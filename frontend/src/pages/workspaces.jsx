import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { loadBoards } from '../store/board.actions';
import { AiOutlineStar, AiOutlineClockCircle } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import { utilService } from '../services/util.service';
import { Loader } from '../components/loader';
import { BoardsList } from '../components/board/boards-list';

export function Workspaces() {
  const boards = useSelector((storeState) => storeState.boardModule.boards);
  const starredBoard = useMemo(() => boards.filter((board) => board.isStarred), [boards]);
  const recentlyViewedBoards = useMemo(
    () => boards.filter((board) => utilService.isLastVisited(board.lastVisited)),
    [boards]
  );

  useEffect(() => {
    loadBoards();
  }, []);

  if (!boards) {
    return <Loader height={'95vh'} />;
  }

  return (
    <section className="workspaces">
      {starredBoard.length > 0 && (
        <BoardsList
          title="Starred boards"
          icon={<AiOutlineStar className="board-title-icon" />}
          boards={starredBoard}
        />
      )}
      {recentlyViewedBoards.length > 0 && (
        // <div>
        <BoardsList
          title="Recently viewed"
          icon={<AiOutlineClockCircle className="board-title-icon" />}
          boards={recentlyViewedBoards}
        />
      )}
      <BoardsList
        title="Your boards"
        icon={<BsPerson className="board-title-icon" />}
        boards={boards}
      />
    </section>
  );
}
