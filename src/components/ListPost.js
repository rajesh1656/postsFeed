import axios from "axios"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { commonFns } from "./common";

export default function ListPost() {

    const [posts, setPosts] = useState([]);
    useEffect(() => {
        getPosts();
    }, []);
    const [page, setPage] = useState(1);
    useBottomScrollListener(getPosts);

    function getPosts() {
        axios.get(`${commonFns.apiUrl}posts/?page=${page}`, {
            headers: {
                [commonFns.apiHeaderKey]: commonFns.apiHeaderValue
            }
        }).then(function (response) {
            // console.log(response.data);
            setPosts(posts.concat(response.data));
            setPage(page + 1);
        });
    }

    const deletePost = (id, feedKey) => {
        if (window.confirm("Are you sure, do you want to delete this post?") === true) {
            axios.delete(`${commonFns.apiUrl}posts/${id}/delete`, {
                headers: {
                    [commonFns.apiHeaderKey]: commonFns.apiHeaderValue
                }
            }).then(function (response) {
                if (response.data && response.data) {
                    if (response.data.status) {
                        toast.success(response.data.message);
                        const box = document.getElementById("feeddiv" + feedKey);
                        //removes element from DOM
                        // box.style.display = 'none';
                        //hides element (still takes up space on page)
                        box.style.display = 'none';
                    } else {
                        toast.error(response.data.message);
                    }
                }
                // console.log(response.data);
                getPosts();
            });
        }
    }
    return (
        <div className="posts-top-pane">
            {/* <h1>List Posts</h1> */}
            {posts && posts.length > 0 && posts.map((val, key) =>
                <div className="post-feed-pane" key={key} id={"feeddiv" + key}>
                    <div className="row post-feed">
                        <div className="col-md-10 post-title">
                            {val.title}
                        </div>
                        <div className="col-md-2">
                            <Link to={`post/${val.id}/edit`} style={{ marginRight: "10px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                            </svg>
                            </Link>
                            <span className="link" onClick={() => deletePost(val.id, key)}>X</span>
                        </div>
                        <div className="col-md-12 post-desc">
                            {val.description}
                        </div>
                    </div>
                </div>
            )}
            {posts && posts.length == 0 &&
                <div className="post-feed-pane">
                    No posts available to see.
                </div>
            }
            <ToastContainer />
        </div>
    )
}
