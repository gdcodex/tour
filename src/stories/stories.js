import React,{useState, useEffect} from 'react'
import './stories.css'
function Stories() {
    const [story, setstory] = useState([]);

    const STORY = [
        {storyUrl:"A"},
        {storyUrl:"B"},
        {storyUrl:"C"},
        {storyUrl:"D"},
        {storyUrl:"E"}   
]

  useEffect(()=>{
    setstory(STORY)
  },[])



    return (
        <div className="stories">
        <img className="arrow-span-scroll" src='/arrow.png' alt="next" onClick={()=>{
            setstory(p=>{
               let first= p.pop();
                p.unshift(first);
                return [...p];
            })
            }}/>
        <div className='stories-container'>
            {story.map((s,i)=><div key={s.storyUrl+i} className="story-circle-box">{s.storyUrl}</div>)}
        </div>
            <img className="arrow-span-scroll-two" src='/arrow.png' alt="next" onClick={()=>{
            setstory(p=>{
               let first= p.shift();
                p.push(first);
                return [...p];
            })}}/>
        </div>
    )
}

export default Stories
