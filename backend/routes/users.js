const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Update user
router.put("/:id", async (req, res) => {
   //Checks if the ids are the same
   if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
         try {
            //Generate new password
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
         } catch (err) {
            return res.status(500).json(err);
         }
      }
      try {
         //Makes the request
         const user = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
         });
         res.status(200).json("Account has been updated");
      } catch (err) {
         return res.status(500).json(err);
      }
   } else {
      return res.status(403).json("You can update only your account");
   }
});

//Delete user
router.delete("/:id", async (req, res) => {
   //Checks if the ids are the same
   if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
         //Makes the request
         const user = await User.findByIdAndDelete(req.params.id);
         res.status(200).json("Account has been deleted successfully");
      } catch (err) {
         return res.status(500).json(err);
      }
   } else {
      return res.status(403).json("You can delete only your account");
   }
});

router.get("/friends/:userId", async (req, res) => {
   try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
         user.following.map((friendId) => {
            return User.findById(friendId);
         })
      );
      let friendList = [];
      friends.map((friend) => {
         const { _id, username, profilePicture } = friend;
         friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList);
   } catch (err) {
      res.status(500).json(err);
   }
});

//get all users
router.get("/users", async (req, res) => {
   try {
      const users = await User.find(); // query all users from the database
      const newUsers = users.map((user) => {
         const { password, updatedAt,profilePicture,coverPicture,followers,createdAt,isAdmin,following, ...other } = user._doc;
         return other;
      });
      res.json(newUsers); // return the list of users as JSON
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
   }
});

//Get a user
router.get("/", async (req, res) => {
   const userId = req.query.userId;
   const username = req.query.username;
   try {
      //Gets the user
      const user = userId
         ? await User.findById(userId)
         : await User.findOne({ username: username });

      //Removes unnecessary information
      const { password, updatedAt, ...other } = user._doc;

      //Makes the request
      res.status(200).json(other);
   } catch (err) {
      res.status(500).json(err);
   }
});

//Follow a user
router.put("/:id/follow", async (req, res) => {
   //Checks if the users(ids) aren't the same
   if (req.body.userId !== req.params.id) {
      try {
         //Gets the user
         const user = await User.findById(req.params.id);

         //Gets the user making the request
         const currentUser = await User.findById(req.body.userId);

         //Checks if the current user isn't already following the user
         if (!user.followers.includes(req.body.userId)) {
            //Makes the request
            await user.updateOne({ $push: { followers: req.body.userId } });
            await currentUser.updateOne({
               $push: { following: req.params.id },
            });
            res.status(200).json("user has been followed");
         } else {
            res.status(403).json("you already follow this user");
         }
      } catch (err) {
         res.status(500).json(err);
      }
   } else {
      res.status(403).json("You can't follow yourself");
   }
});

//Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
   //Checks if the users(ids) aren't the same
   if (req.body.userId !== req.params.id) {
      try {
         //Gets the user
         const user = await User.findById(req.params.id);

         //Gets the user making the request
         const currentUser = await User.findById(req.body.userId);

         //Checks if the current user follows the other user
         if (user.followers.includes(req.body.userId)) {
            //makes the request
            await user.updateOne({ $pull: { followers: req.body.userId } });
            await currentUser.updateOne({
               $pull: { following: req.params.id },
            });
            res.status(200).json("user has been unfollowed");
         } else {
            res.status(403).json("you don't follow this user");
         }
      } catch (err) {
         res.status(500).json(err);
      }
   } else {
      res.status(403).json("You can't unfollow yourself");
   }
});

module.exports = router;
