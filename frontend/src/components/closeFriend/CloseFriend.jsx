import "./closeFriend.css"

export default function CloseFriend({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  return (
    <li className="sidebarFriend">
      <img className="sidebarFriendImg" src={"https://res.cloudinary.com/dmvkam3rh/image/upload/v1682256559/noAvatar_pua4bg.png"} alt="" />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}
