import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";

export default function Messenger() {
   return (
      <>
         <Topbar />
         <div className="messenger">
            <div className="chatMenu">
               <div className="chatMenuWrapper">
                  <input placeholder="Search for friends" className="chatMenuInput" />
                  <Conversation/>
               </div>
            </div>
            <div className="chatBox">
               <div className="chatBoxWrapper">
                  <div className="chatBoxTop">
                     <Message/>
                     <Message own={true}/>
                     <Message/>
                  </div>
                  <div className="chatBoxBottom"></div>
               </div>
            </div>
            <div className="chatOnline">
               <div className="chatOnlineWrapper">online</div>
            </div>
         </div>
      </>
   );
}
