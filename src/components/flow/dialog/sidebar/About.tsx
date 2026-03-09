import clsx from "clsx";

export default function About() {
  return (
    <div
      className={clsx(
        "font-[osrs] [&>h3]:font-bold text-lg px-2",
        "[&_ul]:ml-4 [&_ul]:list-outside [&_ul]:list-disc [&_li]:marker:content-['-__']",
        "leading-5 [&_p]:mb-2",
      )}
    >
      <h3>What is floschart?</h3>
      <p>
        floschart (flos) is a companion app to OSRS that helps you plan your
        goals and track your progression. The name "floschart" is a combination
        of flowchart and os (for oldschool).
      </p>
      <h3>Features</h3>
      <p>
        You can create nodes and draw dependencies between them by dragging a
        line between the triangle-shaped endpoints to the left and right of a
        node. These indicate the direction of a dependency - a triangle facing
        outwards indicates that it is a requirement for another node.
      </p>
      <p>
        You can additionally use the{" "}
        <a
          href="https://oldschool.runescape.wiki/w/RuneScape:WikiSync"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted"
        >
          WikiSync
        </a>{" "}
        plugin to look up some information about your account.
      </p>
      <h3>Nodes</h3>
      <p>
        A Node keeps track of a single goal. A number of node types are
        built-in:
      </p>
      <ul>
        <li>Quests and Miniquests</li>
        <li>Achievement Diaries</li>
        <li>Skill Levels</li>
        <li>(Some) items</li>
        <ul>
          <li>Most combat equipment</li>
          <li>Skilling gear</li>
          <li>Teleports</li>
          <li>Collection logged items</li>
        </ul>
        <li>(Some) unlockables</li>
        <ul>
          <li>Magic Spells</li>
          <li>Prayers</li>
          <li>Furniture</li>
          <li>Slayer Unlocks</li>
        </ul>
      </ul>
      <p>
        There are additionally two generic types of nodes. The "Other" node can
        store a single item, while the "Other (Group)" node is useful for
        storing a list of tasks.
      </p>
      <h3>Development</h3>
      <p>
        For info about development, visit the{" "}
        <a
          href="https://oldschool.runescape.wiki/w/RuneScape:WikiSync"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted"
        >
          GitHub page
        </a>
        . For bug reports, feature requests, or feedback, join the{" "}
        <a
          href="https://discord.gg/BGEcKjqKtp"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted"
        >
          Discord
        </a>
        .
      </p>
      <p>site by neia.</p>
    </div>
  );
}
