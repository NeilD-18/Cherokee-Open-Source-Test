import React, { ReactElement, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../components/Button";
import { CardTable } from "../../components/CardTable";
import { SectionHeading } from "../../components/SectionHeading";
import { cards, keyForCard } from "../../data/cards";
import { collections, VocabSet, vocabSets } from "../../data/vocabSets";
import { UserSetData } from "../../state/reducers/userSets";
import { useUserStateContext } from "../../state/UserStateProvider";
import { useCardsForTerms } from "../../utils/useCardsForTerms";
import { CollectionCredits } from "../../components/CollectionCredits";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export function ViewSet(): ReactElement {
  const { setId } = useParams();
  if (!setId) return <Navigate to="/vocabulary" replace />;
  const set = vocabSets[setId];
  return <_ViewSet set={set} />;
}

const RemoveSetWrapper = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const StyledHeadingWithButton = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;
  h2 {
    margin: 0;
    margin-right: 8px;
    padding: 0;
    flex: 1;
  }
`;

function _ViewSet({ set }: { set: VocabSet }): ReactElement {
  const { addSet, sets, removeSet } = useUserStateContext();
  const [modalIsOpen, setRemoveSetModalOpen] = useState(false);

  const userSetData = sets[set.id] as UserSetData | undefined;

  const navigate = useNavigate();
  const setCards = useCardsForTerms(cards, set.terms, keyForCard);
  const collection = collections[set.collection];

  function addSetAndRedirect() {
    addSet(set.id);
    navigate(`/`);
  }

  function removeSetAndRedirect() {
    removeSet(set.id);
    navigate("/");
  }

  return (
    <div>
      <StyledHeadingWithButton>
        <SectionHeading>
          {collection.title && `${collection.title} - `}
          {set.title}
        </SectionHeading>
        {userSetData ? (
          <span>(you are already learning this set)</span>
        ) : (
          <Button onClick={addSetAndRedirect}>
            Add set and return to dashboard
          </Button>
        )}
      </StyledHeadingWithButton>
      <h3>Collection description</h3>
      <CollectionCredits collection={collection} />
      <h3>Terms in this set</h3>
      <CardTable cards={Object.values(setCards)} />
      {set.id in sets && (
        <RemoveSetWrapper>
          <Button onClick={() => setRemoveSetModalOpen(true)}>
            Stop practicing these terms
          </Button>
        </RemoveSetWrapper>
      )}
      {modalIsOpen && (
        <ConfirmRemoveSetModal
          set={set}
          close={() => setRemoveSetModalOpen(false)}
          confirm={removeSetAndRedirect}
        />
      )}
    </div>
  );
}

function ConfirmRemoveSetModal({
  set,
  close,
  confirm,
}: {
  set: VocabSet;
  close: () => void;
  confirm: () => void;
}): ReactElement {
  return (
    <ConfirmationModal
      title={`Remove set ${set.title}`}
      close={close}
      confirm={confirm}
      confirmContent={<>Delete all data on up to {set.terms.length} terms</>}
    >
      <p>
        If you remove this set, all your data on terms from this set will be
        deleted.
      </p>
      <p>
        You may still see terms from this set if they are in another set you are
        learning.
      </p>
    </ConfirmationModal>
  );
}
