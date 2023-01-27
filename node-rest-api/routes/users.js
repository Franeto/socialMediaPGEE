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

//Get a user
router.get("/:id", async (req, res) => {
  try {
    //Gets the user
    const user = await User.findById(req.params.id);

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
        await currentUser.updateOne({ $push: { following: req.params.id } });
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
        await currentUser.updateOne({ $pull: { following: req.params.id } });
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
