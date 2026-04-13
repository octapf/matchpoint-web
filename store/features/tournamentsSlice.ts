import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTournamentDetail, fetchTournamentsList } from "@/lib/api/tournaments";
import { fetchTeamsForTournament } from "@/lib/api/teams";
import type { Team } from "@/lib/types/team";
import type { TournamentDetail, TournamentListItem } from "@/lib/types/tournament";

async function fetchTournamentPageData(id: string) {
  const [tournament, teams] = await Promise.all([
    fetchTournamentDetail(id),
    fetchTeamsForTournament(id),
  ]);
  return { tournament, teams };
}

export const loadTournaments = createAsyncThunk(
  "tournaments/loadList",
  async (arg: { status?: string } | undefined, { rejectWithValue }) => {
    try {
      return await fetchTournamentsList(arg);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load";
      return rejectWithValue(message);
    }
  },
);

export const loadTournamentPage = createAsyncThunk(
  "tournaments/loadPage",
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchTournamentPageData(id);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load";
      return rejectWithValue(message);
    }
  },
);

/** Background refresh: same data as load, without flipping detail to “loading” (no skeleton). */
export const refreshTournamentPage = createAsyncThunk(
  "tournaments/refreshPage",
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchTournamentPageData(id);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load";
      return rejectWithValue(message);
    }
  },
);

type TournamentsState = {
  list: TournamentListItem[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
  /** Detail + teams for current route. */
  page: { tournament: TournamentDetail; teams: Team[] } | null;
  detailStatus: "idle" | "loading" | "succeeded" | "failed";
  detailError: string | null;
};

const initialState: TournamentsState = {
  list: [],
  listStatus: "idle",
  listError: null,
  page: null,
  detailStatus: "idle",
  detailError: null,
};

const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {
    clearTournamentPage: (state) => {
      state.page = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTournaments.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(loadTournaments.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(loadTournaments.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError =
          typeof action.payload === "string"
            ? action.payload
            : "Unknown error";
      })
      .addCase(loadTournamentPage.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(loadTournamentPage.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.page = action.payload;
      })
      .addCase(loadTournamentPage.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.page = null;
        state.detailError =
          typeof action.payload === "string"
            ? action.payload
            : "Unknown error";
      })
      .addCase(refreshTournamentPage.fulfilled, (state, action) => {
        if (state.detailStatus === "succeeded") {
          state.page = action.payload;
        }
      })
      .addCase(refreshTournamentPage.rejected, () => {
        /* keep showing last good data on silent poll failure */
      });
  },
});

export const { clearTournamentPage } = tournamentsSlice.actions;
export default tournamentsSlice.reducer;
