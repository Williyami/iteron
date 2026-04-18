from analyst import AnalystAgent
from optimizer import OptimizerAgent


async def run_loop(goal: str | None = None) -> None:
    effective_goal = goal or "Improve CTR across all segments"
    print(f"[loop] Starting with goal: {effective_goal}")

    analyst = AnalystAgent()
    analysis = await analyst.run(effective_goal)
    print(f"[analyst] {analysis}")

    optimizer = OptimizerAgent()
    result = await optimizer.run(analysis)
    print(f"[optimizer] {result}")
