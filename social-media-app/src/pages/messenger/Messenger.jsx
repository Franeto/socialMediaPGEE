import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

export default function Messenger() {
   const [conversations, setConversations] = useState([]);
   const [currentChat, setCurrentChat] = useState(null);
   const [messages, setMessages] = useState("");
   const { user } = useContext(AuthContext);

   useEffect(() => {
      const getConversations = async () => {
         try {
            const res = await axios.get(
               "http://localhost:8800/api/conversations/" + user._id
            );
            setConversations(res.data);
         } catch (err) {
            console.log(err);
         }
      };
      getConversations();
   }, [user._id]);

   useEffect(() => {
      const getMessages = async () => {
         try {
            const res = await axios(
               "http://localhost:8800/api/messages/" + currentChat?._id
            );
            setMessages(res.data);
         } catch (err) {
            console.log(err);
         }
      };
      getMessages();
   }, [currentChat]);

   return (
      <>
         <Topbar />
         <div className="messenger">
            <div className="chatMenu">
               <div className="chatMenuWrapper">
                  <input
                     placeholder="Search for friends"
                     className="chatMenuInput"
                  />
                  {conversations.map((c) => (
                     <div onClick={() => setCurrentChat(c)}>
                        <Conversation conversation={c} currentUser={user} />
                     </div>
                  ))}
               </div>
            </div>
            <div className="chatBox">
               <div className="chatBoxWrapper">
                  {currentChat ? (
                     <>
                        <div className="chatBoxTop">
                           {messages.map((m) => (
                              <Message message={m} own={m.sender === user._id}/>
                           ))}
                        </div>
                        <div className="chatBoxBottom">
                           <textarea
                              className="chatMessageInput"
                              placeholder="Съобщи"
                           ></textarea>
                           <button className="chatSubmitButton">Изпрати</button>
                        </div>
                     </>
                  ) : (
                     <span className="noConversationText">
                        {" "}
                        Open a conversation to start a chat.
                     </span>
                  )}
               </div>
            </div>
            <div className="chatOnline">
               <div className="chatOnlineWrapper">
                  <ChatOnline />
               </div>
            </div>
         </div>
      </>
   );
}
