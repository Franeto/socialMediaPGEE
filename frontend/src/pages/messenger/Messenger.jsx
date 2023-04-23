import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

export default function Messenger() {
   const [conversations, setConversations] = useState([]);
   const [currentChat, setCurrentChat] = useState(null);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState("");
   const [arrivalMessage, setArrivalMessage] = useState(null);
   const [showWarning, setShowWarning] = useState(false);
   const [onlineUsers, setOnlineUsers] = useState([]);
   const socket = useRef(io("https://pgee-social-media.herokuapp.com/"));
   const location = useLocation();
   const userID = new URLSearchParams(location.search).get("userId");
   const { user } = useContext(AuthContext);
   const scrollRef = useRef();

   useEffect(() => {
      socket.current = io("https://pgee-social-media.herokuapp.com/");
      socket.current.on("getMessage", (data) => {
         setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
         });
      });
   }, []);

   useEffect(() => {
      const getCurrentConversation = async () => {
         if (userID) {
            try {
               const res = await axios.get(
                  `https://pgee-social-media.herokuapp.com/api/conversations/find/${userID}/${user._id}`
               );
               setCurrentChat(res.data);
            } catch (error) {
               console.log(error);
            }
         }
      };
      getCurrentConversation();
   }, [userID, user._id]);

   useEffect(() => {
      arrivalMessage &&
         currentChat?.members.includes(arrivalMessage.sender) &&
         setMessages((prev) => [...prev, arrivalMessage]);
   }, [arrivalMessage, currentChat]);

   useEffect(() => {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users) => {
         setOnlineUsers(
            user.following.filter((f) => users.some((u) => u.userId === f))
         );
      });
   }, [user]);

   useEffect(() => {
      const getConversations = async () => {
         try {
            const res = await axios.get(
               "https://pgee-social-media.herokuapp.com/api/conversations/" +
                  user._id
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
               "https://pgee-social-media.herokuapp.com/api/messages/" +
                  currentChat?._id
            );
            setMessages(res.data);
         } catch (err) {
            console.log(err);
         }
      };
      getMessages();
   }, [currentChat]);

   useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   const handleSubmit = async (e) => {
      e.preventDefault();

      const message = {
         sender: user._id,
         text: newMessage,
         conversationId: currentChat._id,
      };

      if (message.text.trim() === "") {
         setShowWarning(true);
         return;
      }

      const receiverId = currentChat.members.find(
         (member) => member !== user._id
      );

      socket.current.emit("sendMessage", {
         senderId: user._id,
         receiverId,
         text: newMessage,
      });

      try {
         const res = await axios.post(
            "https://pgee-social-media.herokuapp.com/api/messages",
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
                  {/* <input
                     placeholder="Search for friends"
                     className="chatMenuInput"
                  /> */}
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
                           {messages > 0 ? (
                              <>
                                 {messages.map((m) => (
                                    <div key={m._id} ref={scrollRef}>
                                       <Message
                                          message={m}
                                          own={m.sender === user._id}
                                       />
                                    </div>
                                 ))}
                              </>
                           ) : (
                              <><span className="noConversationText"> Нямаш изпратени съобщения.</span></>
                           )}
                        </div>
                        <div className="chatBoxBottom">
                           <textarea
                              className="chatMessageInput"
                              placeholder={
                                 showWarning
                                    ? "Не можеш да изпращаш празни съобщения"
                                    : "Съобщи"
                              }
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
                     <span className="noConversationText"> Отвори чат.</span>
                  )}
               </div>
            </div>
            <div className="chatOnline">
               <div className="chatOnlineWrapper">
                  <ChatOnline
                     onlineUsers={onlineUsers}
                     currentId={user._id}
                     setCurrentChat={setCurrentChat}
                  />
               </div>
            </div>
         </div>
      </>
   );
}
