import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import Loading from "../../../components/Loading";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { newBlog } from "../../../actions/hostActions";
import {
  blogCreateReq,
  blogCreateLoadingOff,
} from "../../../features/blogs/blogCreateSlice";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//firebase imports
import { storage_bucket } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { updateProfile } from "../../../actions/userAction";
import { getBlogData } from "../../../actions/blogAction";
import { getPropertyData } from "../../../actions/propertyAction";
import MenuComponent from "./menuComponent";
import AddNewProperties from "./AddNewProperties";

function HotelProfile() {
  const navigate = useNavigate();
  const [newBlogReload, setNewBlogReload] = useState(false);
  const [userId, setUserId] = useState("");
  const [host, setHost] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [URL, setURL] = useState("");
  const dispatch = useDispatch();
  const blogCreate = useSelector((state) => state.blogCreate);
  const { loading, blogInfo } = blogCreate;
  const hotelLogin = useSelector((state) => state.userLogin);
  const { userInfo } = hotelLogin;
  const hotelInfo = useSelector((state) => state.hotelWorking);
  const { hostInfo } = hotelInfo;
  const propertyData = useSelector((state) => state.propertyWorking);
  const { propertyInfo } = propertyData;

  useEffect(() => {
    dispatch(getBlogData());
    dispatch(getPropertyData());
    console.log(newBlogReload);
    console.log(propertyInfo);
    if (userInfo) {
      setUserId(userInfo._id);
      setUser(userInfo._id);
      hostInfo.map((obj) => {
        if (obj.user === userInfo._id) {
          setHost(obj);
          console.log("host:", obj);
        }
      });
    } else {
      <Navigate to="/" />;
    }
  }, [host, newBlogReload]);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "video"],
        ["clean"],
        [{ align: [] }],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen2 = () => {
    setUserOpen(true);
  };

  const handleClose2 = () => {
    setUserOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // upload file to firebase
  const uploadFile = (e) => {
    let file = e.target.files[0];
    //create a reference to the file to be uploaded
    let fileRef = ref(storage_bucket, "BlogPics/" + file.name);
    //upload the file
    const uploadTask = uploadBytesResumable(fileRef, file);
    dispatch(blogCreateReq());
    //track progress of file upload
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("upload is " + progress + "% done.");
      if (progress === 100) {
        console.log(file.name);
        //to get back the link....
        getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
          console.log(URL);
          if (URL) {
            console.log("in!!!!");
            setURL(URL);
            dispatch(blogCreateLoadingOff());
          }
        });
      }
    });
  };
  // upload file to firebase
  const uploadFileUser = (e) => {
    let file = e.target.files[0];
    //create a reference to the file to be uploaded
    let fileRef = ref(storage_bucket, "ProfilePics/" + file.name);
    //upload the file
    const uploadTask = uploadBytesResumable(fileRef, file);
    dispatch(blogCreateReq());
    //track progress of file upload
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("upload is " + progress + "% done.");
      if (progress === 100) {
        console.log(file.name);
        //to get back the link....
        getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
          console.log(URL);
          if (URL) {
            console.log("in!!!!");
            setURL(URL);
            dispatch(blogCreateLoadingOff());
          }
        });
      }
    });
  };

  const handleUpdateSubmit = async () => {
    if ((name || email || URL || password) !== "") {
      console.log("name: ", name);
      console.log("email: ", email);
      console.log("password: ", password);
      console.log("URL: ", URL);
      console.log("userId: ", userId);
    } else {
      console.log("somethings missing...");
    }
    await dispatch(updateProfile({ userId, name, email, password, URL }));
    setNewBlogReload(!newBlogReload);
    handleClose2();
  };

  const editUser = (
    <Grid
      container
      sx={{
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Dialog fullScreen open={userOpen} onClose={handleClose2}>
        <DialogContent>
          <section class="bg-gray-100">
            <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
              <div class="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
                <div class="lg:col-span-2 lg:py-12">
                  <img
                    style={{
                      height: "28rem",
                      width: "25rem",
                      borderRadius: "0.5rem",
                    }}
                    src="https://images.pexels.com/photos/3178818/pexels-photo-3178818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="lol no pic"
                  />
                </div>

                <div class="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
                  <form action="" class="space-y-4">
                    <div>
                      <label class="sr-only" for="name">
                        Name
                      </label>
                      <input
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        class="w-full rounded-lg border-gray-200 p-3 text-sm"
                        defaultValue={userInfo.name}
                        // value={userInfo.name}
                        placeholder="Name"
                        type="text"
                        id="name"
                      />
                      <label class="sr-only" for="email">
                        Email
                      </label>
                      <input
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        class="w-full rounded-lg border-gray-200 p-3 text-sm"
                        placeholder="email"
                        defaultValue={userInfo.email}
                        type="text"
                        id="email"
                      />
                      <label class="sr-only" for="password">
                        Password
                      </label>
                      <input
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        class="w-full rounded-lg border-gray-200 p-3 text-sm"
                        placeholder="password"
                        defaultValue={userInfo.password}
                        type="password"
                        id="password"
                      />
                    </div>
                    <div>
                      <span>Update Profile Picture ? Click Here! </span>
                      <IconButton
                        onChange={uploadFileUser}
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                      >
                        <input hidden accept="image/*" type="file" />
                        <PhotoCamera />
                      </IconButton>
                      {loading && <Loading />}
                    </div>

                    <div class="mt-4">
                      <DialogActions>
                        <Button
                          class="inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-3 text-white sm:w-auto"
                          onClick={handleClose2}
                        >
                          Cancel
                        </Button>
                        <Button
                          class="inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-3 text-white sm:w-auto"
                          onClick={handleUpdateSubmit}
                        >
                          Update
                        </Button>
                      </DialogActions>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </Grid>
  );

  const handleBlogSubmit = async () => {
    if ((blogTitle && blogContent && URL) !== "") {
      console.log("Blog Title:", blogTitle);
      console.log("Blog Content:", blogContent);
      console.log("URL:", URL);
      console.log(user);
    } else {
      console.log("somethings missing...");
    }
    await dispatch(newBlog(user, blogTitle, blogContent, URL));
    setNewBlogReload(!newBlogReload);
    handleClose();
    setNewBlogReload(true);
  };

  const createBlog = (
    <Grid
      container
      sx={{
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogContent>
          <section class="bg-gray-100">
            <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
              <div class="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
                <div class="lg:col-span-2 lg:py-12">
                  <img
                    style={{
                      height: "28rem",
                      width: "25rem",
                      borderRadius: "0.5rem",
                    }}
                    src="https://images.pexels.com/photos/3178818/pexels-photo-3178818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="lol no pic"
                  />
                </div>

                <div class="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
                  <form action="" class="space-y-4">
                    <div>
                      <label class="sr-only" for="name">
                        Blog Title
                      </label>
                      <input
                        onChange={(e) => {
                          setBlogTitle(e.target.value);
                        }}
                        class="w-full rounded-lg border-gray-200 p-3 text-sm"
                        placeholder="Blog Title"
                        type="text"
                        id="name"
                      />
                    </div>
                    <div>
                      <label class="sr-only" for="message">
                        Content
                      </label>

                      <ReactQuill
                        theme="snow"
                        value={blogContent}
                        onChange={setBlogContent}
                        className="edior-input"
                        modules={modules}
                        placeholder="Type something..."
                      />
                      <span>Add Images? Click Here! </span>
                      <IconButton
                        onChange={uploadFile}
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                      >
                        <input hidden accept="image/*" type="file" />
                        <PhotoCamera />
                      </IconButton>
                      {loading && <Loading />}
                    </div>

                    <div class="mt-4">
                      <DialogActions>
                        <Button
                          class="inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-3 text-white sm:w-auto"
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          class="inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-3 text-white sm:w-auto"
                          onClick={handleBlogSubmit}
                        >
                          POST
                        </Button>
                      </DialogActions>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </Grid>
  );
  return (
    <>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            sx={{
              marginTop: 10,
              display: "flex",
            }}
          >
            {/* Head */}
            <Grid item xs={12}>
              <Typography variant="h4">Host Profile</Typography>
              <Divider />
            </Grid>
            {/* Edit Profile */}
            <Grid item xs={12}>
              <Typography variant="h5">Edit Profile</Typography>
              {/* edit profile */}
              <div class="max-w-4xlxl w-full mx-auto z-10">
                <div class="flex flex-col">
                  <div class="bg-white border border-white shadow-lg  rounded-3xl p-4 m-4">
                    <div class="flex-none sm:flex">
                      <div class=" relative h-32 w-32   sm:mb-0 mb-3">
                        <img
                          src={userInfo.pic}
                          alt={userInfo.name}
                          class=" w-32 h-32 object-cover rounded-2xl"
                        />
                        <a
                          href="#"
                          class="absolute -right-2 bottom-2   -ml-3  text-white p-1 text-xs bg-green-400 hover:bg-green-500 font-medium tracking-wider rounded-full transition ease-in duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="h-4 w-4"
                            onClick={handleClickOpen2}
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                          </svg>
                        </a>
                        {editUser}
                      </div>
                      <div class="flex-auto sm:ml-5 justify-evenly">
                        <div class="flex items-center justify-between sm:mt-2">
                          <div class="flex items-center">
                            <div class="flex flex-col">
                              <div class="w-full flex-none text-lg text-gray-800 font-bold leading-none">
                                {userInfo.name}
                              </div>
                              <div class="flex-auto text-gray-500 my-1">
                                <span class="mr-3 ">{userInfo.email}</span>
                                <span class="mr-3 border-r border-gray-200  max-h-0"></span>
                                <span>TVM, IND</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* edit profile END*/}
              {/* View Reservations */}
              <Grid container alignContent={"center"}>
                <Grid item xs={6}>
                  <div class="lg:px-4 md:px-44 px-4 flex flex-row items-center justify-center md:gap-28 gap-16">
                    <div class="xl:pt-4 w-full xl:w-1/2 relative pb-12 lg:pb-0">
                      <div class="relative">
                        <div class="">
                          <div class="">
                            <h1 class="my-2 text-gray-800 font-bold text-2xl">
                              Check Your Reservations
                            </h1>
                            <p class="my-2 text-gray-800">Browse your Trips.</p>
                            <button
                              onClick={() => {
                                navigate(`reservation/${userInfo._id}`);
                              }}
                              class="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
                            >
                              Click Here!
                            </button>
                          </div>
                        </div>
                        {/* <div className="">
                          <img
                            src="https://www.freepnglogos.com/uploads/cloud-png/white-big-cloud-png-27.png"
                            alt=""
                          />
                        </div> */}
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div class="lg:px-4 md:px-44 px-4 flex flex-row items-center justify-center md:gap-28 gap-16">
                    <div class="xl:pt-4 w-full xl:w-1/2 relative pb-12 lg:pb-0">
                      <div class="relative">
                        <div class="">
                          <div class="">
                            <h1 class="my-2 text-gray-800 font-bold text-2xl">
                              Check Your Properties Reservations
                            </h1>
                            <p class="my-2 text-gray-800">Browse User Trips.</p>
                            <button
                              onClick={() => {
                                navigate(`reservations/${userInfo._id}`);
                              }}
                              class="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
                            >
                              Click Here!
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
              {/* View Reservations End */}
            </Grid>
            <Grid xs={12}>
              <br />
            </Grid>
            {host.blocked ? null : (
              <>
                {/* Create Blog */}
                <Grid item xs={12}>
                  <Typography display="inline" variant="h5">
                    Create Blog
                  </Typography>
                  <IconButton onClick={handleClickOpen}>
                    <AddCircleOutlineOutlinedIcon fontSize="large" />
                  </IconButton>
                  {createBlog}
                </Grid>
                {/* View This Hosts Blogs */}

                <Grid
                  container
                  className="justify-items-center"
                  style={{ justifySelf: "center" }}
                  spacing={1}
                >
                  {blogInfo.map((item, index) => {
                    if (item.user === userInfo._id)
                      return (
                        <Grid key={index} item xs={3}>
                          <Card sx={{ minHeight: "260px", width: 260 }}>
                            <MenuComponent
                              item={item}
                              setNewBlogReload={setNewBlogReload}
                              newBlogReload={newBlogReload}
                            />

                            <CardCover>
                              <img
                                src={item.blogPic}
                                loading="lazy"
                                alt="lol no pic"
                              />
                            </CardCover>
                            <CardCover
                              sx={{
                                background:
                                  "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                              }}
                            />
                            <CardContent sx={{ justifyContent: "flex-end" }}>
                              <Link
                                to={"/blog-info"}
                                state={{ blogData: item }}
                              >
                                <Typography
                                  level="h2"
                                  fontSize="lg"
                                  mb={1}
                                  style={{ color: "white" }}
                                >
                                  {item.blogTitle}
                                </Typography>
                              </Link>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                  })}
                </Grid>
                {/* Create Hotels */}
                <AddNewProperties
                  setNewBlogReload={setNewBlogReload}
                  newBlogReload={newBlogReload}
                />
                <Grid
                  container
                  className="justify-items-center"
                  style={{ justifySelf: "center" }}
                  spacing={1}
                >
                  {propertyInfo.map((item, index) => {
                    if (item.hostId === userInfo._id)
                      return (
                        <Grid key={index} item xs={3}>
                          <Card sx={{ minHeight: "260px", width: 260 }}>
                            <MenuComponent item={item} />

                            <CardCover>
                              <img
                                src={item.propImages[0]}
                                loading="lazy"
                                alt="lol no pic"
                              />
                            </CardCover>
                            <CardCover
                              sx={{
                                background:
                                  "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                              }}
                            />
                            <CardContent sx={{ justifyContent: "flex-end" }}>
                              <Link
                                to={"/property-info"}
                                state={{ property: item }}
                              >
                                <Typography
                                  level="h2"
                                  fontSize="lg"
                                  mb={1}
                                  style={{ color: "white" }}
                                >
                                  {item.propName}
                                </Typography>
                                <Typography
                                  level="h2"
                                  fontSize="lg"
                                  mb={1}
                                  style={{ color: "white" }}
                                >
                                  BY:{item.hostName}
                                </Typography>
                              </Link>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                  })}
                </Grid>
                {/* </Container> */}
              </>
            )}
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default HotelProfile;
