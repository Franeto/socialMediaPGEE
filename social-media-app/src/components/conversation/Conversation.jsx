import "./conversation.css"

export default function Conversation() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;


  return (
    <div className="conversation">
      <img src={PF + "person/noAvatar.png"} alt="" className="conversationImg" />
      <span className="conversationName">John Doe</span>
    </div>
  )
}
