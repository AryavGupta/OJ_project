import { createSlice, createAsyncThunk, createStore } from "@reduxjs/toolkit";
import API from '../services/api';
import { act } from "react";

// fetch all problems
export const fetchProblems = createAsyncThunk('problems/fetch', async () =>{
  const res = await API.get('/problems');
  return res.data;

});

// create problem (ADMIN ONLY)
export const createProblem = createAsyncThunk('problems/create', async (problemData) => {
  const res = await API.post('/problems', problemData);
  return res.data;
});

// delete a problem
export const deleteProblem = createAsyncThunk('/problems/delete', async (id) => {
  await API.delete(`/problems/${id}`);
  return id;
});

const problemSlice = createSlice({
  name : 'problems',
  initialState : {
    problems : [],
    loading : false,
    error : null,
  },
  reducers : {},
  extraReducers : (builder) => {
    builder
    // fetch
    .addCase(fetchProblems.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchProblems.fulfilled, (state, action) =>{
      state.loading = false;
      state.problems = action.payload;
    })
    .addCase(fetchProblems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

    // create
    .addCase(createProblem.fulfilled, (state, action) => {
      state.problems.push(action.payload);
    })
    // delete
    .addCase(deleteProblem.fulfilled, (state, action) => {
      state.problems = state.problems.filter(p => p._id !== action.payload)
    });
  },
});

export default problemSlice.reducer;
