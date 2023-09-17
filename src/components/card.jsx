import { useSpring, animated,config } from "react-spring";
import { useState, useEffect, useRef } from "react"; // Import useRef
function Star(){
    return(
        <span className="material-symbols-rounded" >grade</span>
    )
}

function Card(props) {
  // Create a ref for this Card component
  const cardRef = useRef(null);
  const stars=Array(props.rating).fill(null)

  //added to cart
  const [addedToCart,setAddedToCart]=useState(false)
  // Use the custom scroll animation hook with the ref
  const animatedProps = useScrollAnimation(cardRef);

  function useScrollAnimation(targetRef) {
    const [isVisible, setIsVisible] = useState(false);

    const animatedProps = useSpring({
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(50px)",
      config:config.slow,
    });

    useEffect(() => {
      const target = targetRef.current;

      const handleScroll = () => {
        const rect = target.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Adjust the threshold value as needed
        const threshold = windowHeight * 0.9;

        if (rect.top < threshold) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      // Attach the scroll event listener
      window.addEventListener("scroll", handleScroll);

      // Initial check when the component mounts
      handleScroll();

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [targetRef]);

    return animatedProps;
  }
  function cartButtonName(){
      // console.log(props)
      return addedToCart?
            <div className="flex items-center justify-center ">
              <span className="material-symbols-rounded">done</span><p>added</p>
            </div>:
            <div className="flex items-center justify-center ">
              <span className="material-symbols-rounded">shopping_cart</span><p>add to cart</p>
            </div>
  }
  return (
    <animated.div ref={cardRef} style={animatedProps}>
        
      <div className="flex flex-col space-y-3 mx-1 my-5 px-2 py-2 text-black rounded-lg w-[240px] h-[430px] bg-zinc-50">
        <img src={props.img} className="h-[247px] w-[224px] " alt="loading" />
        <p className="text-2xl text-center text-fuchsia-700">{props.name}</p>
        <div className="flex items-center">
            <p className="text-1xl">rating</p>
            {stars.map(e=><Star />)}

        </div>
        <div className="flex items-center space-x-3">
            <p className="text-1xl">Price</p>
            <p>{props.cost}</p>
        </div>
        <button className={`text-white bg-zinc-900 rounded-full px-1 py-1`} 
            onClick={()=>{
                if(!addedToCart){
                  props.addToCart(props.id,props.cat)
                  // console.log(props)
                }
                setAddedToCart(true)
            }} >{cartButtonName()}</button>
      </div>
    </animated.div>
  );
}

export default Card;
