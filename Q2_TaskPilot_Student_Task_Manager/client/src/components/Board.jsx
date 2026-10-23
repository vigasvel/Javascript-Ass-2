import TaskCard from './TaskCard';

const COLUMNS = [{ status: 'Pending' }, { status: 'In Progress' }, { status: 'Completed' }];

export default function Board({ tasks, ...handlers }) {
  return (
    <div className="board">
      {COLUMNS.map((c) => {
        const list = tasks.filter((t) => t.status === c.status);
        return (
          <section key={c.status} className={`col col-${c.status.replace(' ', '')}`}>
            <h3>
              <i className="dot" /> {c.status} <span>{list.length}</span>
            </h3>
            {list.map((t) => (
              <TaskCard key={t._id} task={t} {...handlers} />
            ))}
            {!list.length && <p className="empty">Nothing here</p>}
          </section>
        );
      })}
    </div>
  );
}
