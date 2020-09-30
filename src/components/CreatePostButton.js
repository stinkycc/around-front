import React, {Component} from 'react';
import { Modal, Button } from 'antd';
import CreatePostForm from "./CreatePostForm";
import {TOKEN_KEY, API_ROOT, AUTH_HEADER, POS_KEY} from "../constants";

class CreatePostButton extends Component {
    state = { visible: false };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        // console.log(e);
        // this.setState({
        //     visible: false,
        // });

        this.form.validateFields((err, values) =>{
            console.log(values);
            //send files to server
            if(!err){
                //url (token, position)
                const token = localStorage.getItem(TOKEN_KEY);
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));

                const formData = new FormData();
                formData.set('lat', lat);
                formData.set('lon', lon);
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);

                this.setState({ confirmLoading: true });
                fetch(`${API_ROOT}/post`, {
                    method: 'POST',
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`
                    },
                    body: formData,
                }).then(response =>{
                    if(response.ok){
                        console.log(response);
                        return this.props.loadNearByPost();
                    }else{
                        throw new Error("Failed to upload")
                    }

                }).then(() => {
                    this.setState({
                        visible: false,
                    });
                    this.form.resetFields();
                })
                    .catch(err =>{
                    console.log(err);
                })

            }
        })
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    render() {
        const {visible, confirmLoading} = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Creat new post
                </Button>
                <Modal
                    title="Creat new post"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading = {confirmLoading}
                    okText="Create"
                >
                    <CreatePostForm ref={this.getRefForm}/>

                </Modal>
            </div>
        );
    }
    getRefForm = (formObj) => {
        this.form = formObj;
    }


}

export default CreatePostButton;