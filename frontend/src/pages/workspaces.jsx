import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { loadBoards } from '../store/board.actions';
import { AiOutlineStar, AiOutlineClockCircle } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import { utilService } from '../services/util.service';
import { Loader } from '../components/common/loader';
import { BoardsList } from '../components/board/boards-list';

export function Workspaces() {
  const boards = useSelector((storeState) => storeState.boardModule.boards);
  const [filteredBoards, setFilteredBoards] = useState();
  const starredBoards = useMemo(
    () => boards.length > 0 && boards.filter((board) => board.isStarred),
    [boards]
  );
  const recentlyViewedBoards = useMemo(
    () =>
      boards.length > 0 && boards.filter((board) => utilService.isLastVisited(board.lastVisited)),
    [boards]
  );

  useEffect(() => {
    loadingBoards();
  }, []);

  async function loadingBoards() {
    try {
      const filteredBoards = await loadBoards();
      setFilteredBoards(filteredBoards);
    } catch (err) {
      console.log(err);
    }
  }

  if (!filteredBoards || filteredBoards.typeof === 'array') {
    return <Loader height={'95vh'} />;
  }

  return (
    <section className="workspaces">
      {starredBoards.length > 0 && (
        <BoardsList
          title="Starred boards"
          icon={<AiOutlineStar className="board-title-icon" />}
          boards={starredBoards}
        />
      )}
      {recentlyViewedBoards.length > 0 && (
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
