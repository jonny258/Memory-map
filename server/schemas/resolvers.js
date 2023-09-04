const { User, Marker, Like } = require("../models")
const { signToken } = require("../utils/auth");
const mongoose = require("mongoose");

const resolvers = {
    Query: {
        //User
        getAllUsers: async () => {
            return await User.find({}).populate({
              path: "markers",
              model: "Marker",
              populate: {
                path: "user",
                model: "User",
              },
            });
          },
        getUserById: async (_, { userId }) => {
            const user = await User.findById(userId)
              .populate({
                path: "markers",
                populate: {
                  path: "user",
                },
              })
              .populate({
                path: "likes",
                populate: {
                  path: "markers",
                },
              });
            if (!user) {
              throw new Error("Could not find this user");
            }
            return user;
          },

        //MARKER
        getAllMarkers: async () => {
            try {
                const markers = await Marker.find({})
                  .populate("user")
                  .populate({
                    path: "likes",
                    populate: {
                      path: "user",
                      model: "User", // Assuming 'User' is the name of your user model
                    },
                  });
        
                return markers;
              } catch (error) {
                throw new Error("Error fetching all markers");
              }
        },
        getMarkerById: async (_, { markerId }) => {
            try {
                const marker = await Marker.findById(markerId)
                  .populate("user")
                  .populate({
                    path: "likes",
                    populate: {
                      path: "user",
                    },
                  });
                if (!marker) {
                  throw new Error("marker not found");
                }
                return marker;
              } catch (err) {
                console.error(err);
                throw new Error("Error fetching the marker.");
              }
        },
    },
    Mutation: {
        //USER
        createUser: async (_, {input}) => {
            const user = await User.create(input);
      if (!user) {
        throw new Error("Error with making a user");
      }
      const token = signToken(user);
      return { token, user };
        },
        loginUser: async (_, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new Error("Can't find this user");
            }
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new Error("Wrong password!");
            }
      
            const token = signToken(user);
            return { token, user };
          },
          editUser: async (_, { input, userId }) => {
            try {
              const user = await User.findByIdAndUpdate(userId, input, {
                new: true,
              })
      
              if (!user) {
                throw new Error("User not found");
              }
      
              const token = signToken(user);
              return { token, user };
            } catch (err) {
              console.error(err);
              return err;
            }
          },
          deleteUser: async (_, { userId }) => {
            try {
              const deletedUser = await User.findByIdAndDelete(userId);
              if (!deletedUser) {
                throw new Error("User not found");
              }
              return deletedUser;
            } catch (err) {
              console.error(err);
              throw new Error("Failed to delete user.");
            }
          },

        //MARKER
        createMarker: async (_, { input, userId }) => {
            try {
                const marker = new Marker({ ...input, user: userId });
                await marker.save();
        
                await User.findByIdAndUpdate(userId, { $addToSet: { markers: marker._id } });
        
                const markerWithUser = await Marker.findById(marker._id).populate("user");
return markerWithUser 
            } catch (err) {
                console.error(err);
                throw new Error("Failed to add marker.");
            }
        },
        editMarker: async (_, { markerId, input }) => {
            try {
                const marker = await Marker.findOneAndUpdate(
                  { _id: markerId }, 
                  input,
                  { new: true }
                ).populate("user"); 
        
                if (!marker) {
                  throw new Error("marker not found");
                }
        
                return marker;
              } catch (err) {
                console.error(err);
                throw new Error(err.message);
              }
        },
        deleteMarker: async (_, { markerId }) => {
            try {
                const marker = await Marker.findByIdAndDelete(markerId);
                if (!marker) {
                  throw new Error("Marker not found");
                }
                return marker;
              } catch (err) {
                console.error(err);
                throw new Error(err.message);
              }
        },

        //Like
        likeMarker: async (_, { markerId, userId }) => {
            try {
      
              console.log(markerId);
              console.log(userId);
              const existingLike = await Like.findOne({ user: userId, marker: markerId });
              if (existingLike) {
                throw new Error("User has already liked this marker.");
              }
      
              const newLike = new Like({
                user: new mongoose.Types.ObjectId(userId),
                marker: new mongoose.Types.ObjectId(markerId),

              });
              await newLike.save();
      

              const markerToUpdate = await Marker.findById(markerId);
              if (!markerToUpdate) {
                throw new Error("marker not found.");
              }
              markerToUpdate.likes.push(newLike._id);
              await markerToUpdate.save();
      
              // 3. Update the user who liked the marker with the reference to the new Like
              const userToUpdate = await User.findById(userId);
              if (!userToUpdate) {
                throw new Error("User not found.");
              }
              userToUpdate.likes.push(newLike._id);
              await userToUpdate.save();
      
              // 4. Populate the user and marker fields in the newLike document before returning
              const populatedLike = await Like.findById(newLike._id)
                .populate("user")
                .populate("marker");
      
              // 5. Return the newly created Like with populated user and marker fields
              return populatedLike;
            } catch (err) {
              console.error(err);
              throw err;
            }
          },
          unlikeMarker: async (_, { markerId, userId }) => {
            try {
              // 1. Find the Like document based on the markerId and userId.
              console.log(markerId);
              console.log(userId);
              const likeToRemove = await Like.findOne({ marker: markerId, user: userId });
      
              // If there's no such Like, throw an error.
              if (!likeToRemove) {
                throw new Error("Like not found.");
              }
      
              // 2. Update the marker to remove the reference to the Like.
              const markerToUpdate = await Marker.findById(markerId);
              if (!markerToUpdate) {
                throw new Error("marker not found.");
              }
              markerToUpdate.likes.pull(likeToRemove._id);
              await markerToUpdate.save();
      
              // 3. Update the user to remove the reference to the Like.
              const userToUpdate = await User.findById(userId);
              if (!userToUpdate) {
                throw new Error("User not found.");
              }
              userToUpdate.likes.pull(likeToRemove._id);
              await userToUpdate.save();
      
              // 4. Remove the found Like from the database.
              await Like.deleteOne({ _id: likeToRemove._id });
      
              // 5. Return the removed Like object
              return likeToRemove;
            } catch (err) {
              console.error(err);
              throw err;
            }
          },
    }
}

module.exports = resolvers;