import React, {
    createContext,
    useContext,
    ReactNode,
    useCallback,
    useMemo,
} from "react";
import { communitiesApi, Community } from "../services/api/communitiesApi";
import useCommunitiesStore from "../store/useCommunitiesStore";

interface CommunityContextType {
    communities: Community[];
    currentCommunity: Community | null;
    loading: boolean;
    error: string | null;
    fetchCommunities: (skip?: number, limit?: number) => Promise<void>;
    fetchCommunityBySlug: (slug: string) => Promise<void>;
    joinCommunity: (slug: string) => Promise<void>;
    leaveCommunity: (slug: string) => Promise<void>;
    fetchCommunityPosts: (slug: string) => Promise<any[]>;
    clearError: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunities = () => {
    const context = useContext(CommunityContext);
    if (context === undefined) {
        throw new Error("useCommunities must be used within a CommunityProvider");
    }
    return context;
};

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        communities,
        currentCommunity,
        loading,
        error,
        setCommunities,
        setCurrentCommunity,
        setLoading,
        setError,
        clearError: clearErrorStore,
    } = useCommunitiesStore() as any;

    const fetchCommunities = useCallback(async (skip = 0, limit = 20) => {
        setLoading(true);
        try {
            const response = await communitiesApi.listCommunities(skip, limit);
            setCommunities(response);
        } catch (err: any) {
            setError(err.message || "Failed to fetch communities");
        } finally {
            setLoading(false);
        }
    }, [setCommunities, setLoading, setError]);

    const fetchCommunityBySlug = useCallback(async (slug: string) => {
        setLoading(true);
        try {
            const response = await communitiesApi.getCommunity(slug);
            setCurrentCommunity(response);
        } catch (err: any) {
            setError(err.message || "Failed to fetch community");
        } finally {
            setLoading(false);
        }
    }, [setCurrentCommunity, setLoading, setError]);

    const joinCommunity = useCallback(async (slug: string) => {
        try {
            await communitiesApi.joinCommunity(slug);
            // Optionally refresh community or member list
        } catch (err: any) {
            setError(err.message || "Failed to join community");
            throw err;
        }
    }, [setError]);

    const leaveCommunity = useCallback(async (slug: string) => {
        try {
            await communitiesApi.leaveCommunity(slug);
        } catch (err: any) {
            setError(err.message || "Failed to leave community");
            throw err;
        }
    }, [setError]);

    const fetchCommunityPosts = useCallback(async (slug: string) => {
        try {
            return await communitiesApi.getCommunityPosts(slug);
        } catch (err: any) {
            setError(err.message || "Failed to fetch community posts");
            return [];
        }
    }, [setError]);

    const clearError = useCallback(() => {
        clearErrorStore();
    }, [clearErrorStore]);

    const value = useMemo(() => ({
        communities,
        currentCommunity,
        loading,
        error,
        fetchCommunities,
        fetchCommunityBySlug,
        joinCommunity,
        leaveCommunity,
        fetchCommunityPosts,
        clearError,
    }), [
        communities,
        currentCommunity,
        loading,
        error,
        fetchCommunities,
        fetchCommunityBySlug,
        joinCommunity,
        leaveCommunity,
        fetchCommunityPosts,
        clearError,
    ]);

    return (
        <CommunityContext.Provider value={value}>
            {children}
        </CommunityContext.Provider>
    );
};
