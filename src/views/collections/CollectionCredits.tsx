import { ReactElement } from "react";
import { Collection } from "../../data/vocabSets";

export function CollectionCredits({
  collection: { credits },
}: {
  collection: Collection;
}): ReactElement {
  return (
    <div>
      <p>{credits.description}</p>
      <h3>Credits</h3>
      <ul>
        {credits.credits.map(({ role, name }) => (
          <li>
            <strong>{role}</strong>: {name}
          </li>
        ))}
      </ul>
      {credits.externalResources.length > 0 && (
        <>
          <h3>External resources</h3>
          <ul>
            {credits.externalResources.map((resource, i) => (
              <li key={i}>
                <a href={resource.href}>{resource.name}</a>
                {resource.notes && <p>{resource.notes}</p>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}