import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { commonFns } from "./common";

export default function ListPost() {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post(`${commonFns.apiUrl}posts/`, inputs, {
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
            <h1>Create post</h1>
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
                                        <input type="text" name="title" onChange={handleChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <label>Description: </label>
                                    </th>
                                    <td>
                                        <textarea type="text" name="description" onChange={handleChange} />
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
