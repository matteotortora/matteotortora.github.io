import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

/**
 * This hook will take a function, and returns a ref.
 * ref can be assigned to any JSX element as prop, and
 * when the element intersects the upper part of the viewport, the passed
 * in function will be called with the element id as parameter.
 * @param {function} action 
 * @returns {funciton} ref
 */
export default function useScrollObserver(action) {
    const [viewportHeight, setViewportHeight] = useState(() => typeof window === 'undefined' ? 720 : window.innerHeight);
    useEffect(() => {
        const resize = () => setViewportHeight(window.innerHeight);
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);
    const {ref, inView, entry} = useInView({
        rootMargin: `-${Math.round(viewportHeight * 0.2)}px 0px -${Math.round(viewportHeight * 0.6)}px 0px`
    })
    useEffect(() => {
        if (entry && inView) {
            action(entry.target.id);
        }
    }, [entry, action, inView])
    return ref
}
