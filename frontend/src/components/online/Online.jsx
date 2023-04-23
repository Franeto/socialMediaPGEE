import { AccountCircle } from "@mui/icons-material";
import "./online.css";

export default function Online({ user }) {
   const PF = process.env.REACT_APP_PUBLIC_FOLDER;

   return (
      <li className="rightbarFriend">
         <div className="rightbarProfileImgContainer">
            <span className="rightbarProfileImg">
               <AccountCircle sx={{ fontSize: 40 }}/>
            </span>
            <span className="rightbarOnline"></span>
         </div>
         <span className="rightbarUsername">{user.username}</span>
      </li>
   );
}
