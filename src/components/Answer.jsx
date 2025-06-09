import { useEffect, useState } from "react"

const Answer = ({ ans, index , totalresult }) => {
    
    const [heading,Setheading] = useState(false);
    const [answer, setanswer] = useState(ans)
  console.log(index)
    useEffect(() => {
       if(checkheading(ans)){
        Setheading(true)
        setanswer(Replaceheadingstars(ans))
       }
    }, [])

    function checkheading(str){
        return /^(\*)(\*)(.*)\*$/.test(str)
    }

    function Replaceheadingstars(str){
        return str.replace(/^(\*)(\*)|(\*)*$/g,'')
    }

    return (
        <>
           

        {
            index==0 && totalresult>1 ?<span className="pt-2 text-xl block text-white">{answer}</span>:heading? <span className="pt-2 text-lg block text-white">{answer}</span>
            :<span className="pl-5">{answer}</span>
        }


            {/* {heading? <span className={ index==0?"text-3xl": "pt-2 text-lg block text-white-800"}>{answer}</span>
            :<span className="pl-5">{answer}</span>} */}
 
        </>
    )
}
export default Answer