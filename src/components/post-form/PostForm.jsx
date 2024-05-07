import React, { useEffect } from 'react'
import  { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

function PostForm({post}) {

    const{register,handleSubmit,watch,setValue,control,getValues}=useForm({
defaultValues:{
title:post?.title || "",
slug: post?.$id || "",
 content: post?.content || "",
status: post?.status || "active",


}

    });

const navigate=useNavigate();
const userData=useSelector((state)=>state.auth.userData);
              //yeh data jo form se aaya
const submit=async(data)=>{
 
    if(post){    
        //yeh file jo nayi image upload ki vo

        const file=data.image[0]?await appwriteService.uploadFile(data.image[0]):null;
    if(file){
        //purani wali file delete bhi toh krni ha
        appwriteService.deleteFile(post.featuredImage)
    }
    const dbPost=await appwriteService.updatePost(post.$id,{
        ...data,
        featuredImage:file?file.$id:undefined
    })
    if(dbPost){
        navigate(`/post/${dbPost.$id}`)
    }

    }else{
//no post wala
        const file=await appwriteService.uploadFile(data.image[0]);//it return object with info containing about the uploaded file
        if(file){
            //file is like an object with properties like id
            const fileId=file.$id;
            //even if featuredImage not a already a key in data object, still in Js it will be dynamically created so dont worry
            data.featuredImage=fileId;
            const dbPost=await appwriteService.createPost({
                ...data,
                userId:userData.$id
            });

            if(dbPost){
                navigate(`/post/${dbPost.$id}`)
            }

        }

    }

};

const slugTransform=useCallback((value)=>{
    if(value && typeof value==="string"){
        return value.trim().toLowerCase().replace(/[^a-zA-Z\d]+/g, "-")
   /** .replace(/\s/g, "-");*/ 
    }
    

    return "";

},[])


useEffect(()=>{
//subscription unsubsribe is optimization techinqiue for useEffect()
    
//name rakhne se we are able to access name of input fields
//dekh seedha value.title likha,title is name 
//this is possible cause hum name bhi watch kar rahe

const subscription=watch((value,{name})=>{
        if(name==="title"){
            setValue("slug",slugTransform(value.title),{
                shouldValidate:true
            })

        }
    })

    return ()=>{
        subscription.unsubscribe
}


},[watch,slugTransform,setValue])




return (
<form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
<div className="w-2/3 px-2">
    <Input
        label="Title :"
        placeholder="Title"
        className="mb-4"
        {...register("title", { required: true })}
    />
    <Input
        label="Slug :"
        placeholder="Slug"
        className="mb-4"
        {...register("slug", { required: true })}
        onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
        }}
    />
    <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
</div>
<div className="w-1/3 px-2">
    <Input
        label="Featured Image :"
        type="file"
        className="mb-4"
        accept="image/png, image/jpg, image/jpeg, image/gif"
        {...register("image", { required: !post })}
    />
    {post && (
        <div className="w-full mb-4">
            <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="rounded-lg"
            />
        </div>
    )}
    <Select
        options={["active", "inactive"]}
        label="Status"
        className="mb-4"
        {...register("status", { required: true })}
    />
    <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" >
        {post ? "Update" : "Submit"}
    </Button>
</div>
</form>
)


}

export default PostForm