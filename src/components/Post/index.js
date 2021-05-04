import React, {useState, useContext, useEffect} from 'react';
import {UserContext} from "../../providers/UserProvider";
import {db} from "../../firebase/firebase";

function Post({post}) {
    const user = useContext(UserContext);
    const [inputValue, setInputValue] = useState('');
    const {author, authorId, comments, createdAt, likes, postContent, shares, tags} = post.data;

    const addLike = () => {
        db.collection('posts').doc(post['id']).update({
            likes: [...likes, user.uid]
        })
    }

    const removeLike = () => {
        const id = likes.indexOf(user.uid);
        likes.splice(id, 1);

        db.collection('posts').doc(post['id']).update({
            likes: [...likes]
        })
    }

    const onChange = event => {
        setInputValue(event.target.value);
    }

    const addComment = event => {
        event.preventDefault();

        db.collection('posts').doc(post['id']).update({
            comments: [...comments, {author: user.uid, message: inputValue}]
        })

        setInputValue('');
    }

    return (
        <div className="post">
            <div className="post__information">
                <img alt="avatar" />
                <a href={`/profile/${author}`}><p>@{author}</p></a>
                <p>2m</p>
            </div>
            <div className="post__text">
                <p>{postContent}</p>
            </div>
            <div className="post__more__information">
                <div>
                    {likes.length}
                    {user && likes.includes(user.uid) ? <button onClick={() => removeLike()}>Unlike</button> : <button onClick={() => addLike()}>Like</button>}
                </div>
                <div>
                    <p>{comments ? `${comments.length} comments` : '0 comments'}</p>
                </div>
            </div>
            <div className="post__comment__input">
                <form onSubmit={event => addComment(event)}>
                    <input name="newComment" placeholder="Enter comment here" value={inputValue} onChange={event => onChange(event)} />
                </form>
            </div>
        </div>
    )
}

export default Post;