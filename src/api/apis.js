import axiosInstance from './axiosInstance'
import { setAccessToken } from './tokenService'

export const signIn = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/login', userData)
        // setAccessToken(response.data.data.accessToken);
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error;

    }
}
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/user/create-user', userData)

        return response
    } catch (error) {
        throw error.response ? error.response.data : error;

    }
}
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/user/all-users')

    return response
  } catch (error) {
    console.error(error)
  }
}
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/user/delete-user/${id}`)

    return response
  } catch (error) {
    console.error(error)
  }
}
export const editUser = async (userData) => {
  try {
    const response = await axiosInstance.patch(`/user/edit-user/${userData._id}`, userData)

    return response
  } catch (error) {
    console.error(error)
  }
}

export const createFaq = async (faqData) => {
    try {
        const response = await axiosInstance.post('/faq/create-faq', faqData)
        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const getFaqs = async () => {
    try {
        const response = await axiosInstance.get('/faq/all-faqs')
        return response.data
    } catch (error) {
        console.error(error);

    }
}

export const deletefaq = async (id) => {
  try {
    const response = await axiosInstance.delete(`/faq/delete-faq/${id}`)

    return response.data
  } catch (error) {
    console.error(error)
  }
}
export const editFaq = async (id, faqData) => {
    try {
        const response = await axiosInstance.patch(`/faq/edit-faq/${id}`, faqData)

    return response.data
  } catch (error) {
    console.error(error)
  }
}
export const editHomeFaq = async (id, faqData) => {
    try {
        const response = await axiosInstance.patch(`/faq/edit-home-faq/${id}`, faqData)

    return response.data
  } catch (error) {
    console.error(error)
  }
}
export const editFaqOrder = async (id, faqData) => {
    try {
        const response = await axiosInstance.patch(`/faq/edit-faq-order/${id}`, faqData)

    return response.data
  } catch (error) {
    console.error(error)
  }
}
export const getEnquiries = async (page, limit, filters = {}) => {
    try {
        const params = { page, limit };

        if (filters.search) params.search = filters.search;
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;

        const response = await axiosInstance.get(`/enquiry/all-enquiries`, { params });

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


export const deleteEnquiries = async (id) => {
  try {
    const response = await axiosInstance.delete(`/enquiry/delete-enquiry/${id}`)

    return response.data
  } catch (error) {
    console.error(error)
  }
}


export const addBlog = async (blogData) => {
    try {
       const response = await axiosInstance.post(`/blog/add-blog`, blogData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error;


    }
}
export const getBlogs = async (query = "") => {
    try {
        const response = await axiosInstance.get(`/blog/get-blogs${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getBlog = async (id) => {
    try {
          const response = await axiosInstance.get(`/blog/get-blog/${id}`)
        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const updateBlog = async (id, blogData) => {
    try {
       const response = await axiosInstance.put(`/blog/update-blog/${id}`, blogData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error;

    }
}
export const deleteBlog = async (id) => {
    try {
    const response = await axiosInstance.delete(`/blog/delete-blog/${id}`)
        return response.data
    } catch (error) {
        console.error(error);

    }
}

/**
======= Newsletter APIs ========
 **/

export const subscribeNewsletter = async (email) => {
  try {
    const response = await axiosInstance.post('/newsletter/subscribe', { email })
    return response.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const getSubscribers = async (options = {}) => {
  try {
    const res = await axiosInstance.get('/newsletter/subscribers', { params: options })
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const unsubscribeNewsletter = async (token) => {
  try {
    const response = await axiosInstance.post('/newsletter/unsubscribe', { token })
    return response.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const exportSubscribersFile = async (options = {}) => {
  try {
    const res = await axiosInstance.get('/newsletter/subscribers', {
      params: options,
      responseType: 'blob',
    })
    return res
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const blockSubscriber = async (payload = {}) => {
  // payload: { id?, email?, reason? }
  try {
    const res = await axiosInstance.post('/newsletter/block', payload)
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const getBlockedSubscribers = async (options = {}) => {
  try {
    const res = await axiosInstance.get('/newsletter/blocked', { params: options })
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const unblockSubscriber = async (payload = {}) => {
  // payload: { id?, email? }
  try {
    const res = await axiosInstance.post('/newsletter/unblock', payload)
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const deleteSubscriber = async (id) => {
  try {
    const response = await axiosInstance.delete(`/newsletter/${id}`)
    return response.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

/* ------------------ COMMON PACKAGES ------------------ */

export const getAllCommonPackages = async (options = {}) => {
  // options: { type: 'home' | 'freezone' } -> maps to ?type=home
  try {
    const res = await axiosInstance.get('/packages/common', { params: options })
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const getCommonPackageById = async (id) => {
  try {
    const res = await axiosInstance.get(`/packages/common/${id}`)
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const createCommonPackage = async (data) => {
  try {
    const res = await axiosInstance.post('/packages/common', data)
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const updateCommonPackage = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/packages/common/${id}`, data)
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const deleteCommonpackage = async (id) => {
  try {
    const res = await axiosInstance.delete(`/packages/common/${id}`)
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

export const getCommonPackageCounts = async () => {
  try {
    const res = await axiosInstance.get('/packages/common/counts')
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

/* ------------------ CATEGORY PACKAGES ------------------ */
// Create category package (nested). body: { categoryKey, pageName, title, price, points: [] }
export const createCategoryPackage = async (formData) => {
  try {

    const res = await axiosInstance.post('/packages/category', formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

// Get category packages. If categoryKey provided returns that doc; if pageName provided returns packages of that page.
export const getCategoryPackages = async (page,innerPage) => {
  try {
    // params: { categoryKey, pageName }
    const res = await axiosInstance.get(`/packages/category?page=${page}&innerPage=${innerPage}`)
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

// Update nested package:
// PUT /category/:categoryKey/pages/:pageName/packages/:packageId
export const updateCategoryPackage = async (packageId,packageData) => {
  try {
    const res = await axiosInstance.put(`/packages/category/update-package/${packageId}`, packageData,{
  headers: {
    "Content-Type": "multipart/form-data"
  }
})
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

// Delete nested package:
export const deleteCategoryPackage = async ( categoryId) => {
  try {
 const res = await axiosInstance.delete(
      `/packages/category/delete-package`,
      { params: { categoryId } } // ✅ best practice
    );    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}

// Get page counts for a category
export const getCategoryPageCounts = async (categoryKey) => {
  try {
    const res = await axiosInstance.get(`/packages/category/${categoryKey}/counts`)
    return res.data
  } catch (error) {
    if (error?.response?.data) throw error.response.data
    throw error
  }
}


/* ------------------ SEO  ------------------ */

export const saveSeo = async (seoData) => {
    try {
        const response = await axiosInstance.post(`/seo/add-seo`, seoData)
        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const getSeo = async (selectedPage, selectedInnerPage) => {
    try {
        const response = await axiosInstance.get(`/seo/get-seo/?page=${selectedPage}&innerPage=${selectedInnerPage}`)
        return response.data
    } catch (error) {
        console.error(error);

    }
}

/* ------------------ Gallery  ------------------ */

export const addGallery = async (galleryImage) => {
    try {
        const response = await axiosInstance.post(`/gallery/add-image`, galleryImage, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const getGallery = async (page,limit) => {
    try {
        const response = await axiosInstance.get(`/gallery/get-images?page=${page}&limit=${limit}`)
        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const deleteGalleryImage = async (id) => {
    try {
        const response = await axiosInstance.delete(`/gallery/delete-image/${id}`)
        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const getHeroSection = async () => {
    try {
        const response = await axiosInstance.get(`/herosection/get-herosection`)
        return response.data
    } catch (error) {
        console.error(error);

    }
}
export const updateHeroSection = async (heroData) => {
    try {
        const response = await axiosInstance.put(`/herosection/save-herosection`,heroData)
        return response.data
    } catch (error) {
        console.error(error);

    }
}




export const getOverview = async (days = 7) => {
  const res = await axiosInstance.get(`/analytics/overview?days=${days}`);
  return res.data;
};


export const getRealtime = async (limit = 50) => {
  const res = await axiosInstance.get(`/analytics/realtime?limit=${limit}`);
  return res.data;
};

export async function downloadAnalyticsCsv({ start, end, dimensions = "pagePath", metrics = "screenPageViews" }) {
  const url = `/analytics/export?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&dimensions=${encodeURIComponent(dimensions)}&metrics=${encodeURIComponent(metrics)}`;
  const response = await axiosInstance.get(url, { responseType: "blob" });

}

//===== Analytics =====//

export const getPerformance = async (range = '7d') => {
  const res = await axiosInstance.get(`/analytics/performance?range=${encodeURIComponent(range)}`);
  return res.data;
};

export const getPerformanceTrend = async (range = '7d', metric = 'screenPageViews') => {
  const res = await axiosInstance.get(`/analytics/performance/trend?range=${encodeURIComponent(range)}&metric=${encodeURIComponent(metric)}`);

  return res.data;
};


export const getKpis = async (days = 28) => {
  const res = await axiosInstance.get(`/analytics/kpis?days=${days}`);
  return res.data; 
};


export const getSessionsByCountry = async (
  range = '3mo', 
  topN = 250, 
  metric = 'activeUsers'
) => {
  try {
    const response = await axiosInstance.get(
      `/analytics/sessions-by-country`,
      {
        params: { range, topN, metric },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('❌ API Error (getSessionsByCountry):', error.response?.data || error.message);
    throw error;
  }
};


export const getTopPages = async ({
  days = 28,
  limit = 10
}) => {
  const res = await axiosInstance.get(
    `/analytics/top-pages?days=${days}&limit=${limit}`
  );
  return res.data.data;
};


export const getActiveUsersByDevice = async ({
range = "28d"
}) => {
  try {
      const res = await axiosInstance.get(
     `/analytics/active-users-by-device`, { params: { range } }
  );
  return res.data.data;
    
  } catch (error) {
      console.error( error.response?.data || error.message);
    throw error;
  }

};


export const getStorageUsage = async () => {
  try {
      const res = await axiosInstance.get("/settings/storage");
  return res.data.data;
  } catch (error) {
        console.error( error.response?.data || error.message);
    throw error;
  }

};

