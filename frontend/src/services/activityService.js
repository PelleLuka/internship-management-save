import axios from "axios";

/**
 * Service: Get Activities
 * Retrieves list of IDs for all ACTIVE activities.
 * 
 * @returns {Promise<Array<{id: number}>>} Promise resolving to array of activity ID objects.
 */
export const getActivities = async () => {
    const res = await axios.get("/api/activities");
    return res.data;
};

/**
 * Service: Get Activity By ID
 * Retrieves full details of a specific activity.
 * 
 * @param {number} id - The ID of the activity.
 * @returns {Promise<Object>} The activity details.
 */
export const getActivityById = async (id) => {
    const res = await axios.get(`/api/activities/${id}`);
    return res.data;
};

/**
 * Service: Create Activity
 * Creates a new activity.
 * 
 * @param {Object} activity - The activity data (title, etc.).
 * @returns {Promise<Object>} The created activity object including new ID.
 */
export const createActivity = async (activity) => {
    const res = await axios.post("/api/activities", activity);
    return res.data;
};

/**
 * Service: Update Activity
 * Updates an activity (e.g. rename or toggle visibility).
 * 
 * @param {number} id - The ID of the activity.
 * @param {Object} activity - The updated data.
 * @returns {Promise<Object>} The updated activity object.
 */
export const updateActivity = async (id, activity) => {
    const res = await axios.patch(`/api/activities/${id}`, activity);
    return res.data;
};

/**
 * Service: Delete Activity
 * Soft-deletes an activity.
 * 
 * @param {number} id - The ID of the activity.
 * @returns {Promise<void>}
 */
export const deleteActivity = async (id) => {
    await axios.delete(`/api/activities/${id}`);
};
