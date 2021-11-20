import { useEffect } from "react";
import { useDispatch} from 'react-redux';
import { setSearchLoaded } from './searchSlice';

function useClickOut(ref, ref2, ref3) {   
    const dispatch = useDispatch();

    useEffect(() => {
        function handleClickOutside(event) {
            if(!ref2.current){
                if (ref.current && !ref.current.contains(event.target)) {
                    dispatch(setSearchLoaded(false));
                }
            }
            else{
                if ((ref.current && !ref.current.contains(event.target)) && 
                    (ref2.current && !ref2.current.contains(event.target)) &&
                    (ref3.current && !ref3.current.contains(event.target))) {
                    dispatch(setSearchLoaded(false));
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export default useClickOut;
