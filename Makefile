.PHONY: test-all

TEST_FILES=$(wildcard test/*.js)

test-all:
	@@for FILE in $(TEST_FILES); do node $$FILE ; done
