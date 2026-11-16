export function fitSceneInSlot(slot,aspectRatio) {
    if (!slot || slot.width <= 0 || slot.height <= 0) return null;
    const width = Math.min(slot.width,slot.height*aspectRatio);
    const height = width/aspectRatio;
    return {left:slot.left+(slot.width-width)/2,top:slot.top+(slot.height-height)/2,width,height};
}

export function inlineSceneVisibility(region,viewportHeight,headerHeight = 72) {
    if (!region || region.top >= viewportHeight || region.top+region.height <= headerHeight) return 0;
    return Math.max(0,Math.min(1,(region.top+region.height-headerHeight)/(region.height*0.6)));
}

export function placeSceneCanvas(canvas,root,aspectRatio) {
    const slot = document.querySelector('[data-background-slot]');
    const placement = fitSceneInSlot(slot?.getBoundingClientRect(),aspectRatio);
    if (placement) {
        const origin = root.getBoundingClientRect();
        const styles = {left:`${placement.left-origin.left}px`,top:`${placement.top-origin.top}px`,
            width:`${placement.width}px`,height:`${placement.height}px`,right:'auto',bottom:'auto'};
        for (const [name,value] of Object.entries(styles)) if (canvas.style[name] !== value) canvas.style[name] = value;
    } else {
        for (const name of ['left','top','width','height','right','bottom']) if (canvas.style[name]) canvas.style.removeProperty(name);
    }
    root.dataset.layout = placement ? 'inline' : 'ambient';
    const bounds = canvas.getBoundingClientRect();
    return {width:bounds.width,height:bounds.height,inline:Boolean(placement),region:placement,slot};
}
