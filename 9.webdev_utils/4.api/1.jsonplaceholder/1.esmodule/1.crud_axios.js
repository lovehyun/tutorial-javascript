import axios from 'axios';

// 1. 특정 사용자 ID를 기준으로 게시글을 가져옵니다.
const userId = 1;
const getUserPosts = async () => {
    const postsUrl = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
    const postsResponse = await axios.get(postsUrl);
    const postsData = postsResponse.data;

    console.log("Posts by user 1:");
    postsData.forEach(post => {
        console.log(post);
    });

    // 2. 게시글 ID를 기준으로 첫 번째 게시글의 댓글을 가져옵니다.
    const postId = 1;
    const commentsUrl = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
    const commentsResponse = await axios.get(commentsUrl);
    const commentsData = commentsResponse.data;

    console.log("\nComments for post 1:");
    commentsData.forEach(comment => {
        console.log(comment);
    });

    // 3. 게시글 데이터와 댓글 데이터를 결합합니다.
    const postComments = [];
    postsData.forEach(post => {
        if (post.id === postId) {
            commentsData.forEach(comment => {
                const combined = { ...post, ...comment }; // 객체 병합
                postComments.push(combined);
            });
        }
    });

    console.log("\nCombined post and comments for post 1:");
    postComments.forEach(item => {
        console.log(item);
    });

    // 4. 여러 사용자의 게시글 수 계산하기
    const allPostsUrl = 'https://jsonplaceholder.typicode.com/posts';
    const allPostsResponse = await axios.get(allPostsUrl);
    const allPostsData = allPostsResponse.data;

    const postCounts = {};
    allPostsData.forEach(post => {
        const userId = post.userId;
        if (postCounts[userId]) {
            postCounts[userId] += 1;
        } else {
            postCounts[userId] = 1;
        }
    });

    console.log("\nPost counts by user:");
    Object.keys(postCounts).forEach(userId => {
        console.log(`User ${userId}: ${postCounts[userId]} posts`);
    });
};

// 비동기 함수 실행
getUserPosts().catch(error => {
    console.error("Error fetching data:", error);
});
