import { Breadcrumb, Card, Skeleton } from "antd";

export default function Loading() {
  return (
    <>
      <Breadcrumb
        items={[{ title: "Dashboard" }]}
        style={{ margin: "8px 0" }}
      ></Breadcrumb>
      <div className='space-y-2'>
        <Card className='main-content-h'>
          <Skeleton active />
        </Card>
      </div>
    </>
  );
}
