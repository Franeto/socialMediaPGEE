import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import {io} from "socket.io-client"

export default function Messenger() {
   const [conversations, setConversations] = useState([]);
   const [currentChat, setCurrentChat] = useState(null);
   const [messages, setMessages] = useState("");
   const [newMessage, setNewMessage] = useState("");
   const socket = useRef(io("ws://localhost:8900"))
   const { user } = useContext(AuthContext);
   const scrollRef = useRef();

   useEffect(()=>{
      socket.current.emit("addUser", user._id)
      socket.current.on("getUsers",users=>{
         console.log(users)
      })
   },[user]);

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

   useEffect(()=>{
      scrollRef.current?.scrollIntoView({behavior: "smooth"})
   },[messages])

   const handleSubmit = async (e) => {
      e.preventDefault();
      const message = {
         sender: user._id,
         text: newMessage,
         conversationId: currentChat._id,
      };

      try {
         const res = await axios.post(
            "http://localhost:8800/api/messages",
            message
         );
         setMessages([...messages, res.data]);
         setNewMessage("");
      } catch (err) {
         console.log(err);
      }
   };

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
                     <div key={c._id} onClick={() => setCurrentChat(c)}>
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
                              <div key={m._id} ref={scrollRef}>
                                 <Message
                                    message={m}
                                    own={m.sender === user._id}
                                 />
                              </div>
                           ))}
                        </div>
                        <div className="chatBoxBottom">
                           <textarea
                              className="chatMessageInput"
                              placeholder="Съобщи"
                              onChange={(e) => setNewMessage(e.target.value)}
                              value={newMessage}
                           ></textarea>
                           <button
                              className="chatSubmitButton"
                              onClick={handleSubmit}
                           >
                              Изпрати
                           </button>
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
