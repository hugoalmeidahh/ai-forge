#!/usr/bin/env python3
"""AI Forge entry point for optional, read-only local UI research."""

import argparse
import json
from pathlib import Path
import sys


sys.dont_write_bytecode = True

ENGINE = Path(__file__).resolve().parents[1] / "vendor" / "ui-ux-pro-max" / "scripts"
sys.path.insert(0, str(ENGINE))
from core import AVAILABLE_STACKS, CSV_CONFIG, search, search_stack
from design_system import generate_design_system


def result_limit(value):
    limit = int(value)
    if not 1 <= limit <= 20:
        raise argparse.ArgumentTypeError("max-results must be between 1 and 20")
    return limit


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="AI Forge — pesquisa local de interface")
    parser.add_argument("query", help="Termos de pesquisa")
    target = parser.add_mutually_exclusive_group()
    target.add_argument("--domain", choices=sorted(CSV_CONFIG), help="Área do catálogo")
    target.add_argument("--stack", choices=sorted(AVAILABLE_STACKS), help="Stack da consulta")
    target.add_argument("--design-system", action="store_true", help="Propor uma direção de design")
    parser.add_argument("--max-results", type=result_limit, default=3)
    parser.add_argument("--json", action="store_true", help="Retornar dados estruturados")
    parser.add_argument("--format", "-f", choices=["ascii", "markdown"], default="markdown")
    args = parser.parse_args()
    if not args.query.strip():
        parser.error("A consulta precisa conter termos de pesquisa")
    if args.design_system:
        recommendation = generate_design_system(args.query, None, args.format, persist=False)
        if args.json:
            print(json.dumps({"design_system": recommendation["design_system"]}, ensure_ascii=False, indent=2))
        else:
            print(recommendation["text"])
        return
    result = search_stack(args.query, args.stack, args.max_results) if args.stack else search(args.query, args.domain, args.max_results)
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        if "error" in result:
            raise SystemExit(1)
        return
    print("# AI Forge — pesquisa de interface")
    print(f"\nConsulta: {args.query}\nResultados: {result.get('count', 0)}")
    if "error" in result:
        print(f"\nErro: {result['error']}")
        raise SystemExit(1)
    for index, row in enumerate(result.get("results", []), 1):
        print(f"\n## Resultado {index}")
        for key, value in row.items():
            print(f"- {key}: {value}")
    if not result.get("results"):
        print("\nSem correspondência verificada. Reformule a consulta ou use as referências da skill.")


if __name__ == "__main__":
    main()
