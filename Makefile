.PHONY: help dev build install

help:
	@printf "Available targets:\n"
	@printf "  make dev      Start local server at http://localhost:5173\n"
	@printf "  make build    No-op build placeholder for static site\n"
	@printf "  make install  No-op install placeholder\n"

dev:
	python3 -m http.server 5173 --directory public

build:
	@echo "No build step for this static site."

install:
	@echo "No install step required."
