import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { commonFns } from "./common";

export default function ListPost() {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        getPost();
    }, []);

    function getPost() {
        axios.get(`${commonFns.apiUrl}posts/${id}`, {
            headers: {
                [commonFns.apiHeaderKey]: commonFns.apiHeaderValue
            }
        }).then(function (response) {
            // console.log(response.data);
            setInputs(response.data);
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        axios.put(`${commonFns.apiUrl}posts/${id}/edit`, inputs, {
            headers: {
                [commonFns.apiHeaderKey]: commonFns.apiHeaderValue
            }
        }).then(function (response) {
            // console.log(response.data);
            if (response.data && response.data) {
                if (response.data.status) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            }
            setTimeout(() => {
                navigate('/')
            }, 1000);
        });

    }
    return (
        <div className="posts-top-pane">
            <h1>Edit post</h1>
            <div className="post-feed-pane">
                <div className=" post-feed">

                    <form onSubmit={handleSubmit}>
                        <table cellSpacing="10" width="90%">
                            <tbody>
                                <tr>
                                    <th width="30%">
                                        <label>Title: </label>
                                    </th>
                                    <td width="70%">
                                        <input value={inputs.title} type="text" name="title" onChange={handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label>Description: </label>
                                    </th>
                                    <td>
                                        <textarea value={inputs.description} type="text" name="description" onChange={handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td align="left">
                                        <button>Save</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
