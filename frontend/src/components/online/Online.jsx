import "./online.css";

export default function Online({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  
  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img src={"https://res.cloudinary.com/dmvkam3rh/image/upload/v1682256559/noAvatar_pua4bg.png"} alt="" className="rightbarProfileImg" />
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
}
