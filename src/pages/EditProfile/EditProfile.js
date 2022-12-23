import "./EditProfile.css";

import { uploads } from "../../utils/config";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { profile, updateProfile, resetMessage } from "../../slices/userSlice";

// Components
import Message from "../../components/Message";

const Profile = () => {
  const dispatch = useDispatch();

  const { user, message, error, loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  // Load user data
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  // fill user form
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather user data from states
    const userData = {
      name,
    };

    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (bio) {
      userData.bio = bio;
    }

    if (password) {
      userData.password = password;
    }

    // build form data
    const formData = new FormData();

    const userFormData = Object.keys(userData).forEach((key) =>
      formData.append(key, userData[key])
    );

    formData.append("user", userFormData);

    await dispatch(updateProfile(formData));

    setTimeout(() => {
      dispatch(resetMessage())
    }, 2000)
  }

  const handleFile = (e) => {
    // image preview
    const image = e.target.files[0];

    setPreviewImage(image);

    // change image state
    setProfileImage(image);
  };

  return (
    <div id="edit-profile">
      <h2>Edit your personal data</h2>
      <p className="subtitle">
      Add a profile picture, and tell us a little more about yourself...
      </p>
      {(user.profileImage || previewImage) && (
        <img
          className="profile-image"
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : `${uploads}/users/${user.profileImage}`
          }
          alt={user.name}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name || ""}
        />
        <input type="email" placeholder="E-mail" disabled value={email || ""} />
        <label>
          <span>Profile Picture:</span>
          <input type="file" onChange={handleFile} />
        </label>
        <label>
          <span>Bio:</span>
          <input
            type="text"
            placeholder="Profile description"
            onChange={(e) => setBio(e.target.value)}
            value={bio || ""}
          />
        </label>
        <label>
          <span>Want to change your password?</span>
          <input
            type="password"
            placeholder="Enter your new password..."
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
          />
        </label>
        {!loading && <input type="submit" value="Update" />}
        {loading && <input type="submit" disabled value="Loading..." />}
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </form>
    </div>
  );
};

export default Profile;