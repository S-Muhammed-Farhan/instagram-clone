import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { Button, Modal, makeStyles, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [postsRight, setPostsRight] = useState([]);
  const [uploadbutton, setUploadbutton] = useState(false);

  useEffect(() => {
    const unsubscribe2 = db.collection("postsRight").onSnapshot((snapshot) => {
      setPostsRight(
        snapshot.docs.map((doc) => ({
          post: doc.data(),
        }))
      );
    });
    return unsubscribe2;
  }, []);

  useEffect(() => {
    const unsubscribe1 = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe1();
    };
  }, [user, username]);

  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
    return unsubscribe;
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

      setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false); //after login it will close automatically
  };


  return (
    <div className="app">
      <Modal open={uploadbutton} onClose={() => setUploadbutton(false)}>
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
            <center>
              <img
                src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2010.svg"
                alt=""
                className="app__headerImage"
              />
            </center>
          {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <h3>Oops looks like you haven't logged in, login to upload </h3>
          )}
          </form>
        </div>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2010.svg"
                alt=""
                className="app__headerImage"
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2010.svg"
                alt=""
                className="app__headerImage"
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2010.svg"
          alt=""
          className="app__headerImage"
        />

        <Button onClick={() => setUploadbutton(true)}>Upload</Button>
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>LogIn</Button>
            <Button onClick={() => setOpen(true)}>Sign-Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app__postsRight">
          {postsRight.map(({ post }) => (
            <Post
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
