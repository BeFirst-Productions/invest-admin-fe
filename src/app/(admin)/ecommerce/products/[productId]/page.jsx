import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import { getProductById } from '@/helpers/data';
import ProductDetailView from './components/ProductDetailView';
import ProductImages from './components/ProductImages';
import PageMetaData from '@/components/PageTitle';
import { getBlog } from '@/api/apis';
const ProductDetail = () => {
  const [product, setProduct] = useState();
  const {
    blogId
  } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      if (blogId) {
        const data = await getBlog(blogId);        
        if (data) setProduct(data.data)
      }
    })();
  }, [blogId]);
  return <>
      <PageBreadcrumb title="Blog Details" subName="Blog" />
      <PageMetaData title={product?.name ?? 'Product Details'} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col lg={4} style={{ position: 'sticky', top: '90px', alignSelf: 'flex-start' }}>
                  {product && <ProductImages product={product} />}
                </Col>
                <Col lg={8}>{product && <ProductDetailView product={product} />}</Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>;
};
export default ProductDetail;