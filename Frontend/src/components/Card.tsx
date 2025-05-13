import { BinIcon } from "../Icons/BinIcon";
import { ShareIcon } from "../Icons/ShareIcon";

interface CardProps {
    title: string;
    link: string;
    type: "twitter" | "youtube";
}

const Card = ({title, link, type}:CardProps) => {
  return (
    <>
    <div className="p-5 m-5 bg-white rounded-md border-gray-400 border min-h-65 min-w-48 size-50 ">
       <div className="flex justify-between">
            <div className="flex items-center text-md">
                
                {title}
            </div>
            <div className="flex items-center">
                <div className="pr-2">
                    <a href={link} target="_blank">
                        <ShareIcon/>
                    </a>
                </div>
                <BinIcon/>
            </div>
        </div>

        <div className="pt-4">
        {type === "youtube" && (
            <iframe className="w-full"
            src={link.replace("watch","embed").replace("?v=","/")}
            title="Youtube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            
            ></iframe>
        )}
        {type === "twitter" && (
            <blockquote className="twitter-tweet">
                <a href={link.replace("x.com","twitter.com")}></a>
            </blockquote>
        )}
    </div>
    </div>
    
    </>
  )
}

export default Card