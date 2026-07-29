import { yupResolver } from '@hookform/resolvers/yup';
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import TextFormInput from '@/components/form/TextFormInput';
import { Col, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const generalFormSchema = yup.object({
  name: yup.string().required('Blog title is required'),
  reference: yup.string().required('Excerpt is required'),
  description: yup.string().required('Description is required'),

  url: yup
    .string()
    .required("URL is required")
    .matches(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed"),
});





const GeneralDetailsForm = forwardRef(({ updateBlogData, blogData,formErrors }, ref) => {
  const initialLoad = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    register,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(generalFormSchema),
    defaultValues: {
      name: "",
      reference: "",
      description: "",
      url: ""
    },
  });

  const [productDescriptionContent, setProductDescriptionContent] = useState("");

  // Expose validateStep() to parent
  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      const isValid = await trigger();
      return isValid;
    },
  }));

  // Load initial data (edit mode)
  useEffect(() => {
    if (blogData.title && !initialLoad.current) {
      reset({
        name: blogData.title || "",
        reference: blogData.excerpt || "",
        description: blogData.description || "",
        url: blogData.url || ""   // ✅ INCLUDED IN RESET
      });

      setProductDescriptionContent(blogData.description || "");
      initialLoad.current = true;
    }
  }, [blogData, reset]);

  // Sync parent data from form fields except description (handled separately)
  useEffect(() => {
    const sub = watch((values) => {
      updateBlogData({
        title: values.name,
        excerpt: values.reference,
        url: values.url,   // ✅ INCLUDED IN SYNC
      });
    });

    return () => sub.unsubscribe && sub.unsubscribe();
  }, [watch, updateBlogData]);



  return (
    <form noValidate>

      <input type="hidden" {...register("description")} />

      {/* Title + Excerpt */}
      <Row>
        <Col lg={6}>
          <TextFormInput
            control={control}
            label="Blog Title"
            placeholder="Enter blog title"
            containerClassName="mb-3"
            id="blog-title"
            name="name"
          />
        </Col>

        <Col lg={6}>
          <TextFormInput
            control={control}
            name="reference"
            placeholder="Enter excerpt"
            label="Excerpt"
            containerClassName="mb-3"
          />
        </Col>
      </Row>

      {/* URL NAME FIELD */}
      <Row>
        <Col lg={6}>
          <TextFormInput
            control={control}
            name="url"
            placeholder="Enter URL "
            label="URL Name"
            containerClassName="mb-3"
            id="url-name"
          />

        {formErrors?.url && (
  <p className="text-danger small">{formErrors.url}</p>
)}
        </Col>

      </Row>



      {/* DESCRIPTION */}
      <Row>
        <Col lg={12}>
          <div className="mb-5 mt-3">
            <label className="form-label">Blog Description</label>

            <ReactQuill
              theme="snow"
              style={{ height: 195 }}
              value={productDescriptionContent}
              onChange={(val) => {
                setProductDescriptionContent(val);
                setValue("description", val, { shouldValidate: true });
                updateBlogData({ description: val });
              }}
            />
          </div>

          {errors.description && (
            <p className="text-danger small mt-1">
              {errors.description.message}
            </p>
          )}
        </Col>
      </Row>
    </form>
  );
});

export default GeneralDetailsForm;
