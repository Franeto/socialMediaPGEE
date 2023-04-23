import { AccountCircle } from "@mui/icons-material";
import "./closeFriend.css"

export default function CloseFriend({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  return (
    <li className="sidebarFriend">
      <span className="sidebarFriendImg"><AccountCircle/></span>
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}
