import clsx from 'clsx';
import React, { useEffect, useState, useRef } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import GeneralDetailsForm from './GeneralDetailsForm';
import MetaDataForm from './MetaDataForm';
import ProductGalleryForm from './ProductGalleryForm';
import ProductSubmittedForm from './ProductSubmittedForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { addBlog, updateBlog } from '@/api/apis';
import { toast } from 'react-toastify';

const formSteps = [
  { index: 1, name: 'Blog Detail', icon: 'bxs:contact', component: GeneralDetailsForm },
  { index: 2, name: 'Blog Image', icon: 'bx:images', component: ProductGalleryForm },
  { index: 3, name: 'Meta Data', icon: 'bxs:book', component: MetaDataForm },
  { index: 4, name: 'Finish', icon: 'bxs:check-circle', component: ProductSubmittedForm }
];

const CreateBlogForms = () => {

  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const generalRef = useRef();  // Step 1 validation
  const metaRef = useRef();     // Step 3 validation

  const editingBlog = location?.state?.blog || null;
  const isEditMode = Boolean(editingBlog);

  const [blogData, setBlogData] = useState({
    title: '',
    excerpt: '',
    description: '',
    image: '',
    existingImage: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    canonical: '',
    url: ''
  });

  useEffect(() => {
    if (isEditMode && editingBlog) {
      setBlogData({
        title: editingBlog.title,
        excerpt: editingBlog.excerpt,
        description: editingBlog.description,
        image: null,
        existingImage: editingBlog.image,
        metaTitle: editingBlog.metaTitle,
        metaKeywords: editingBlog.metaKeywords,
        metaDescription: editingBlog.metaDescription,
        canonical: editingBlog.canonical,
        url: editingBlog.url
      });
    }
  }, [isEditMode, editingBlog]);

  const updateBlogData = (patch) => {
    setBlogData(prev => ({ ...prev, ...patch }));
  };

  // VALIDATION PER STEP
  const validateStep = async () => {
    if (activeStep === 1) {
      return await generalRef.current.validateStep();
    }

    if (activeStep === 2) {
      return blogData.image || blogData.existingImage;
    }

    if (activeStep === 3) {
      return await metaRef.current.validateMetaStep();
    }

    return true;
  };

  const handleNext = async () => {
    const ok = await validateStep();
    if (!ok) return;  // Stay here if form invalid

    setActiveStep(prev => prev + 1);
  };

  const isFormValid = () => {
    return (
      blogData.title.trim() &&
      blogData.excerpt.trim() &&
      blogData.description.trim() &&
      (blogData.image || blogData.existingImage) &&
      blogData.metaTitle.trim() &&
      blogData.metaKeywords.trim() &&
      blogData.metaDescription.trim() &&
      blogData.url.trim()
    );
  };

  const handleSubmitBlog = async () => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields before submitting.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(blogData).forEach(([key, value]) => {
        if (key === "image") return; 
        // handled later
        formData.append(key, value);
      });

      if (blogData.image) formData.append("image", blogData.image);
      else formData.append("image", blogData.existingImage);

      const res = isEditMode
        ? await updateBlog(editingBlog._id, formData)
        : await addBlog(formData);

      if (res.success) {
        toast.success(isEditMode ? "Blog updated successfully!" : "Blog added successfully!");
        navigate("/blogs");
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err.message;

      toast.error(errorMsg || "Error saving blog. Try again!");
      let newErrors = {};

      // URL related error
      if (errorMsg.includes("URL") || errorMsg.includes("exists")) {
        newErrors.url = errorMsg;
      }


      // Required field errors
      if (errorMsg.includes("required")) {
        newErrors.general = errorMsg;
      }

      // Save errors so form shows them immediately
      setFormErrors(newErrors);

      // Move back to Step 1 always for validation issues
      setActiveStep(1);
    } finally { setIsSubmitting(false); }
  };


  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">{isEditMode ? "Edit Blog" : "Create Blog"}</h4>

        <button
          className="btn btn-outline-danger"
          onClick={() => navigate("/blogs")}
        >
          Cancel
        </button>
      </div>

      <Tabs
        activeKey={activeStep}
        className="nav nav-tabs card-tabs"
        onSelect={() => { }}
        style={{ pointerEvents: "none" }}
      >
        {formSteps.map(step => {
          const Component = step.component;

          return (
            <Tab
              key={step.index}
              eventKey={step.index}
              tabClassName="pb-3"
              title={
                <span className="fw-semibold">
                  <IconifyIcon icon={step.icon} className="me-1" />
                  <span>{step.name}</span>
                </span>
              }
            >
              <Component
                ref={step.index === 1 ? generalRef : step.index === 3 ? metaRef : null}
                updateBlogData={updateBlogData}
                blogData={blogData}
                formErrors={formErrors}  //
                error={activeStep === 2 && (!blogData.image && !blogData.existingImage)
                  ? "Image is required"
                  : null}
              />

            </Tab>
          );
        })}
      </Tabs>

      <div className="d-flex justify-content-between mt-3">
        <button
          onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
          className="btn btn-primary"
          disabled={activeStep === 1}
        >
          <IconifyIcon icon="bx:left-arrow-alt" className="me-2" />
          Back
        </button>

        {activeStep < formSteps.length ? (
          <button onClick={handleNext} className="btn btn-primary">
            Next <IconifyIcon icon="bx:right-arrow-alt" className="ms-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmitBlog}
            className="btn btn-success"
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? "Saving..." : "Submit Blog"}
          </button>
        )}
      </div>
    </>
  );
};

export default CreateBlogForms;
