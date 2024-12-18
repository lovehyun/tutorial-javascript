import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
    name: 'videos',
    initialState: {
        query: '',
        videos: [],
        selectedVideo: null,
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        setVideos: (state, action) => {
            state.videos = action.payload;
        },
        setSelectedVideo: (state, action) => {
            state.selectedVideo = action.payload;
        },
    },
});

export const { setQuery, setVideos, setSelectedVideo } = videoSlice.actions;
export default videoSlice.reducer;
