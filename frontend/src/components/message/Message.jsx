import "./message.css";
import {format} from "timeago.js"
import TimeAgo from "react-timeago";
import bgStrings from "react-timeago/lib/language-strings/bg";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const formatter = buildFormatter(bgStrings);


export default function Message({message,own}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img src={PF + "person/noAvatar.png"} alt="" className="messageImg"/>
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">
      <TimeAgo date={message.createdAt} formatter={formatter} />
      </div>
    </div>
  )
}