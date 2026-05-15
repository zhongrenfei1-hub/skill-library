import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-wide py-32 text-center">
      <div className="font-serif text-7xl text-clay">404</div>
      <h1 className="mt-6 text-3xl font-serif font-medium">这一页我们也没找到。</h1>
      <p className="mt-4 text-ink-mute">可能链接拼错了,或者这份 skill 还没添加。</p>
      <div className="mt-10 flex justify-center gap-3">
        <Link to="/" className="btn btn-primary">回首页</Link>
        <Link to="/skills" className="btn btn-ghost">看全部 skills</Link>
      </div>
    </div>
  );
}
