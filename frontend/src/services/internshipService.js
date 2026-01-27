import axios from "axios";

/**
 * Service: Get Internships
 * Retrieves the list of internship IDs from the backend.
 * 
 * @returns {Promise<Array<{id: number}>>} Promise resolving to an array of internship ID objects.
 */
export const getInternships = async () => {
    const res = await axios.get("/api/internships");
    return res.data;
};

/**
 * Service: Delete Internship
 * Sends a request to delete an internship by ID.
 * 
 * @param {number} id - The ID of the internship to delete.
 * @returns {Promise<void>}
 */
export const deleteInternship = async (id) => {
    await axios.delete(`/api/internships/${id}`);
};

/**
 * Service: Update Internship
 * Updates an existing internship with new data.
 * 
 * @param {number} id - The ID of the internship.
 * @param {Object} internship - The updated internship data.
 * @returns {Promise<Object>} The updated internship object.
 */
export const updateInternship = async (id, internship) => {
    const res = await axios.put(`/api/internships/${id}`, internship);
    return res.data;
};

/**
 * Service: Get Internship By ID
 * Retrieves full details of a specific internship.
 * 
 * @param {number} id - The ID of the internship.
 * @returns {Promise<Object>} The internship details.
 */
export const getInternshipById = async (id) => {
    const res = await axios.get(`/api/internships/${id}`);
    return res.data;
};

/**
 * Service: Create Internship
 * Creates a new internship.
 * 
 * @param {Object} internship - The new internship data.
 * @returns {Promise<Object>} The created internship object.
 */
export const createInternship = async (internship) => {
    const res = await axios.post("/api/internships", internship);
    return res.data;
};

/**
 * Service: Link Activity
 * Links an activity to an internship.
 * 
 * @param {number} internshipId - The ID of the internship.
 * @param {number} activityId - The ID of the activity.
 * @returns {Promise<Object>} The linked activity object.
 */
export const addActivityToInternship = async (internshipId, activityId) => {
    const res = await axios.post(`/api/internships/${internshipId}/activities/${activityId}`);
    return res.data;
};

/**
 * Service: Unlink Activity
 * Removes an activity link from an internship.
 * 
 * @param {number} internshipId - The ID of the internship.
 * @param {number} activityId - The ID of the activity.
 * @returns {Promise<void>}
 */
export const removeActivityFromInternship = async (internshipId, activityId) => {
    await axios.delete(`/api/internships/${internshipId}/activities/${activityId}`);
};

/**
 * Service: Get Internship Activities
 * Retrieves all activities linked to an internship, including soft-deleted ones.
 * 
 * @param {number} internshipId - The ID of the internship.
 * @returns {Promise<Array<Object>>} List of activity objects.
 */
export const getInternshipActivities = async (internshipId) => {
    const res = await axios.get(`/api/internships/${internshipId}/activities`);
    return res.data;
};
