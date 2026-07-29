import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import PageMetaData from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { deleteBlog, getBlogs } from "@/api/apis";
import DeleteConfrimModal from "../../Common/DeleteConfrimModal";
import { toast } from "react-toastify";

const BlogCard = ({ post, onDelete, onEdit, onView }) => {
  const { title, image, excerpt, updatedAt } = post;

  return (
    <Card className="h-100 shadow-sm border-0">
      
      <CardBody>
        <div className="text-center">

          {/* Image */}
          <div className="position-relative">
            <img
              src={image}
              alt={title}
              className="img-fluid rounded mb-3"
              style={{ height: 180, objectFit: "cover", width: "100%" }}
            />

          </div>

          {/* Title */}
          <h4 className="fs-18 mt-2  fw-semibold">{title}</h4>

          {/* Date */}
          <div className="text-muted small mb-2">
            <IconifyIcon icon="mdi:calendar" className="me-1" />
            {new Date(updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Excerpt */}
          <p className="" style={{ minHeight: 60 }}>
            {excerpt}
          </p>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-2 mt-2">
            <Button
              variant="outline-info"
              size="sm"
              className="px-3 py-2"
              onClick={() => onView(post)}
            >
              <IconifyIcon icon="mdi:eye-outline" className="fs-20" />
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              className="px-3 py-2"
              onClick={() => onEdit(post)}
            >
              <IconifyIcon icon="bx:edit" className="fs-20" />
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              className="px-3 py-2"
              onClick={() => onDelete(post)}
            >
              <IconifyIcon icon="bx:trash" className="fs-20" />
            </Button>
          </div>

        </div>
      </CardBody>
    </Card>
  );
};

const Blogs = () => {
  const [blogData, setBlogData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const navigate = useNavigate();

  // Fetch Blogs
  const fetchBlogs = async () => {
    let url = `/?page=${page}&limit=8`;

    const response = await getBlogs(url);

    if (response?.success) {
      setBlogData(response.data);
      setTotalPages(response.totalPages);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  // Handle delete
  const handleDeleteClick = (post) => {
    setDeleteModal(true);
    setSelectedBlog(post);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);

      const res = await deleteBlog(selectedBlog._id);

      if (res.success) {
        fetchBlogs();
        toast.success(res.message);
        setDeleteModal(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <PageBreadcrumb subName="Pages" title="Blog" />

        <Button variant="primary" size="sm" onClick={() => navigate("/blogs/add-blog")}>
          <IconifyIcon icon="bx:plus" className="me-1" /> Add Blog
        </Button>
      </div>

      <PageMetaData title="Blog" />

      {/* BLOG LIST */}
      <Row className="row-cols-1 row-cols-md-2 row-cols-xl-4 gx-3">
        {blogData.length > 0 ? (
          blogData.map((post) => (
            <Col key={post._id} className="mb-3">
              <BlogCard
                post={post}
                onDelete={handleDeleteClick}
                onEdit={(p) => navigate(`/blogs/edit-blog/${p._id}`, { state: { blog: p } })}
                onView={(p) => navigate(`/blogs/details/${p._id}`)}
              />
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <p className="fs-5 fw-medium text-muted">No Blogs Found</p>
          </Col>
        )}
      </Row>

      {/* PAGINATION */}
      {blogData.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li className={`page-item ${page === i + 1 ? "active" : ""}`} key={i}>
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
            </li>
          </ul>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <DeleteConfrimModal
          confirmDelete={confirmDelete}
          isDeleting={isDeleting}
          handleModal={() => setDeleteModal(false)}
          blogToDelete={selectedBlog}
        />
      )}
    </>
  );
};

export default Blogs;
